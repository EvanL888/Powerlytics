"""
Fivetran Custom Connector for IoT Smart Meter Data
This connector extracts energy consumption data from IoT devices and syncs to BigQuery
"""

import requests
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SmartMeterConnector:
    """
    Custom Fivetran connector for IoT smart meter data
    """
    
    def __init__(self, api_key: str, api_url: str):
        """
        Initialize the connector
        
        Args:
            api_key: API key for authentication
            api_url: Base URL for the smart meter API
        """
        self.api_key = api_key
        self.api_url = api_url.rstrip('/')
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })
    
    def test_connection(self) -> bool:
        """
        Test the connection to the API
        
        Returns:
            bool: True if connection is successful
        """
        try:
            response = self.session.get(f'{self.api_url}/health')
            return response.status_code == 200
        except Exception as e:
            logger.error(f"Connection test failed: {e}")
            return False
    
    def get_devices(self) -> List[Dict[str, Any]]:
        """
        Fetch all devices from the API
        
        Returns:
            List of device records
        """
        try:
            response = self.session.get(f'{self.api_url}/devices')
            response.raise_for_status()
            data = response.json()
            
            devices = []
            for device in data.get('devices', []):
                devices.append({
                    'device_id': device['device_id'],
                    'name': device['name'],
                    'location': device['location'],
                    'installation_date': datetime.utcnow().isoformat() + 'Z'
                })
            
            logger.info(f"Fetched {len(devices)} devices")
            return devices
            
        except Exception as e:
            logger.error(f"Error fetching devices: {e}")
            return []
    
    def get_readings(self, device_id: str, start_time: Optional[datetime] = None, 
                     end_time: Optional[datetime] = None) -> List[Dict[str, Any]]:
        """
        Fetch readings for a specific device
        
        Args:
            device_id: Device identifier
            start_time: Start time for readings (default: 24 hours ago)
            end_time: End time for readings (default: now)
            
        Returns:
            List of reading records
        """
        if start_time is None:
            start_time = datetime.utcnow() - timedelta(days=1)
        if end_time is None:
            end_time = datetime.utcnow()
        
        try:
            params = {
                'device_id': device_id,
                'start': start_time.isoformat() + 'Z',
                'end': end_time.isoformat() + 'Z'
            }
            
            response = self.session.get(f'{self.api_url}/readings', params=params)
            response.raise_for_status()
            data = response.json()
            
            readings = data.get('data', [])
            logger.info(f"Fetched {len(readings)} readings for device {device_id}")
            
            return readings
            
        except Exception as e:
            logger.error(f"Error fetching readings for device {device_id}: {e}")
            return []
    
    def sync_incremental(self, state: Dict[str, Any]) -> tuple[Dict[str, List[Dict]], Dict[str, Any]]:
        """
        Perform incremental sync based on state
        
        Args:
            state: Previous sync state containing last sync timestamps
            
        Returns:
            Tuple of (records, new_state)
            - records: Dictionary with table names as keys and lists of records as values
            - new_state: Updated state for next sync
        """
        records = {
            'devices': [],
            'readings': []
        }
        
        # Get current timestamp for new state
        current_sync_time = datetime.utcnow()
        
        # Fetch devices (full refresh)
        records['devices'] = self.get_devices()
        
        # Fetch readings incrementally
        last_sync = state.get('last_sync_timestamp')
        if last_sync:
            start_time = datetime.fromisoformat(last_sync.replace('Z', ''))
        else:
            # First sync: get last 7 days of data
            start_time = current_sync_time - timedelta(days=7)
        
        # Fetch readings for each device
        devices = records['devices']
        for device in devices:
            device_id = device['device_id']
            readings = self.get_readings(
                device_id=device_id,
                start_time=start_time,
                end_time=current_sync_time
            )
            records['readings'].extend(readings)
        
        # Update state
        new_state = {
            'last_sync_timestamp': current_sync_time.isoformat() + 'Z',
            'total_devices': len(records['devices']),
            'total_readings': len(records['readings'])
        }
        
        logger.info(f"Sync completed: {len(records['devices'])} devices, {len(records['readings'])} readings")
        
        return records, new_state


def update(configuration: Dict[str, Any], state: Dict[str, Any]) -> tuple[Dict[str, List[Dict]], Dict[str, Any]]:
    """
    Main entry point for Fivetran sync
    
    Args:
        configuration: Connector configuration
        state: Previous sync state
        
    Returns:
        Tuple of (records, new_state)
    """
    api_key = configuration.get('api_key', 'demo-key')
    api_url = configuration.get('api_url', 'http://localhost:5000')
    
    connector = SmartMeterConnector(api_key=api_key, api_url=api_url)
    
    # Test connection
    if not connector.test_connection():
        raise ConnectionError("Failed to connect to smart meter API")
    
    # Perform sync
    records, new_state = connector.sync_incremental(state)
    
    return records, new_state


def schema(configuration: Dict[str, Any]) -> Dict[str, Any]:
    """
    Return the schema for this connector
    
    Args:
        configuration: Connector configuration
        
    Returns:
        Schema definition
    """
    from schema import get_schema
    return get_schema()


if __name__ == '__main__':
    # Test the connector locally
    config = {
        'api_key': 'test-key',
        'api_url': 'http://localhost:5000'
    }
    
    state = {}
    
    try:
        records, new_state = update(config, state)
        print(f"\nSync Results:")
        print(f"Devices: {len(records['devices'])}")
        print(f"Readings: {len(records['readings'])}")
        print(f"\nNew State: {json.dumps(new_state, indent=2)}")
        
        # Show sample records
        if records['devices']:
            print(f"\nSample Device: {json.dumps(records['devices'][0], indent=2)}")
        if records['readings']:
            print(f"\nSample Reading: {json.dumps(records['readings'][0], indent=2)}")
            
    except Exception as e:
        print(f"Error: {e}")
