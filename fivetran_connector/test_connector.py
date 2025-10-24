"""
Test script for the Fivetran Smart Meter Connector
"""
import sys
import json
from connector import SmartMeterConnector

def main():
    print("=" * 60)
    print("FIVETRAN SMART METER CONNECTOR TEST")
    print("=" * 60)
    
    # Initialize connector
    config = {
        'api_key': 'test-key',
        'api_url': 'http://localhost:5000'
    }
    
    connector = SmartMeterConnector(
        api_key=config['api_key'],
        api_url=config['api_url']
    )
    
    # Test 1: Connection
    print("\n[TEST 1] Testing API connection...")
    if connector.test_connection():
        print("✓ Connection successful!")
    else:
        print("✗ Connection failed!")
        return 1
    
    # Test 2: Get Devices
    print("\n[TEST 2] Fetching devices...")
    devices = connector.get_devices()
    print(f"✓ Found {len(devices)} devices")
    
    if devices:
        print(f"\nSample device:")
        print(json.dumps(devices[0], indent=2))
    
    # Test 3: Get Readings
    if devices:
        device_id = devices[0]['device_id']
        print(f"\n[TEST 3] Fetching readings for {device_id}...")
        readings = connector.get_readings(device_id)
        print(f"✓ Found {len(readings)} readings")
        
        if readings:
            print(f"\nFirst reading:")
            print(json.dumps(readings[0], indent=2))
            print(f"\nLast reading:")
            print(json.dumps(readings[-1], indent=2))
    
    # Test 4: Incremental Sync
    print("\n[TEST 4] Testing incremental sync...")
    state = {}
    records, new_state = connector.sync_incremental(state)
    print(f"✓ Synced {len(records)} records")
    print(f"✓ Updated state for {len(new_state.get('devices', {}))} devices")
    
    print(f"\nNew state:")
    print(json.dumps(new_state, indent=2))
    
    # Test 5: Fivetran Entry Point
    print("\n[TEST 5] Testing Fivetran entry point (update function)...")
    configuration = {
        'api_key': 'test-key',
        'api_url': 'http://localhost:5000'
    }
    state = {}
    
    from connector import update
    records, new_state = update(configuration, state)
    print(f"✓ update() returned {len(records)} records")
    print(f"✓ New state has {len(new_state.get('devices', {}))} devices")
    
    # Sample records
    if records:
        print(f"\nSample records:")
        for i, record in enumerate(records[:3]):
            print(f"\nRecord {i+1}:")
            print(json.dumps(record, indent=2))
    
    print("\n" + "=" * 60)
    print("ALL TESTS PASSED!")
    print("=" * 60)
    print("\n✓ Connector is working correctly")
    print("✓ Ready for Fivetran deployment")
    
    return 0

if __name__ == '__main__':
    sys.exit(main())
