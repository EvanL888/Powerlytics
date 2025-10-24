import { useState, useEffect, useRef } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { Zap, TrendingUp, AlertTriangle, DollarSign, MessageSquare, Send, Home, Calendar, Clock, Brain, BarChart3, X, ChevronRight, Shield, Sparkles } from 'lucide-react'

// Mock data for energy consumption
const hourlyData = [
  { time: '00:00', consumption: 0.8, cost: 0.12 },
  { time: '02:00', consumption: 0.6, cost: 0.09 },
  { time: '04:00', consumption: 0.5, cost: 0.08 },
  { time: '06:00', consumption: 1.2, cost: 0.18 },
  { time: '08:00', consumption: 2.5, cost: 0.38 },
  { time: '10:00', consumption: 2.8, cost: 0.42 },
  { time: '12:00', consumption: 3.2, cost: 0.48 },
  { time: '14:00', consumption: 3.5, cost: 0.53 },
  { time: '16:00', consumption: 2.9, cost: 0.44 },
  { time: '18:00', consumption: 4.2, cost: 0.63 },
  { time: '20:00', consumption: 3.8, cost: 0.57 },
  { time: '22:00', consumption: 2.1, cost: 0.32 },
];

const weeklyData = [
  { day: 'Mon', consumption: 42, forecast: 40, anomaly: false },
  { day: 'Tue', consumption: 38, forecast: 39, anomaly: false },
  { day: 'Wed', consumption: 45, forecast: 41, anomaly: true },
  { day: 'Thu', consumption: 41, forecast: 40, anomaly: false },
  { day: 'Fri', consumption: 39, forecast: 38, anomaly: false },
  { day: 'Sat', consumption: 35, forecast: 36, anomaly: false },
  { day: 'Sun', consumption: 33, forecast: 34, anomaly: false },
];

const HomePage = ({ onNavigate }) => {
  const [visibleCards, setVisibleCards] = useState([false, false, false]);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);

  useEffect(() => {
    const observers = [];
    const refs = [card1Ref, card2Ref, card3Ref];
    
    refs.forEach((ref, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleCards((prev) => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }
          });
        },
        { threshold: 0.3 }
      );

      if (ref.current) {
        observer.observe(ref.current);
        observers.push({ observer, ref: ref.current });
      }
    });

    return () => {
      observers.forEach(({ observer, ref }) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950">
      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-4xl">
          <div className="inline-flex items-center gap-3 bg-blue-500/10 border border-blue-500/30 rounded-full px-6 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">AI-Powered Energy Intelligence</span>
          </div>
          <h1 className="text-7xl font-bold text-white mb-8 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
            Welcome to Powerlytics
          </h1>
          <p className="text-2xl text-blue-200 max-w-3xl mx-auto mb-12 leading-relaxed">
            Transform your energy consumption with real-time insights, AI-driven forecasting, and personalized recommendations that help you save money and reduce your carbon footprint.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-10 py-5 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50 inline-flex items-center gap-2 text-lg"
          >
            Get Started
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 px-6">
        <div className="space-y-32 mb-32 max-w-2xl mx-auto">
          <div 
            ref={card1Ref}
            className={`bg-slate-800/50 backdrop-blur-lg rounded-2xl p-12 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-1000 transform text-center ${
              visibleCards[0] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'
            }`}
          >
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-6">AI Forecasting</h3>
            <p className="text-slate-300 leading-relaxed text-lg">
              Vertex AI models predict your energy consumption patterns and identify anomalies before they impact your bill. Stay ahead with intelligent forecasts.
            </p>
          </div>

          <div 
            ref={card2Ref}
            className={`bg-slate-800/50 backdrop-blur-lg rounded-2xl p-12 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-1000 transform text-center ${
              visibleCards[1] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'
            }`}
          >
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-6">Real-Time Analytics</h3>
            <p className="text-slate-300 leading-relaxed text-lg">
              Connect your smart meters via our custom Fivetran connector. Get instant insights from BigQuery-powered analytics on your energy usage.
            </p>
          </div>

          <div 
            ref={card3Ref}
            className={`bg-slate-800/50 backdrop-blur-lg rounded-2xl p-12 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-1000 transform text-center ${
              visibleCards[2] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'
            }`}
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-6">Conversational AI</h3>
            <p className="text-slate-300 leading-relaxed text-lg">
              Ask questions naturally. Our RAG-powered assistant answers queries like "Why was my usage high?" and suggests optimal appliance schedules.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-6 pb-20">
        <div className="max-w-7xl mx-auto bg-slate-800/50 backdrop-blur-lg rounded-2xl p-12 border border-blue-500/20 mb-20">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h4 className="text-lg font-semibold text-white mb-2">Connect Devices</h4>
              <p className="text-sm text-slate-400">Link your IoT smart meters via our Fivetran connector</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h4 className="text-lg font-semibold text-white mb-2">Ingest Data</h4>
              <p className="text-sm text-slate-400">Automated nightly loads to BigQuery with feature engineering</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h4 className="text-lg font-semibold text-white mb-2">AI Analysis</h4>
              <p className="text-sm text-slate-400">Vertex AI models forecast usage and detect anomalies</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
              <h4 className="text-lg font-semibold text-white mb-2">Get Insights</h4>
              <p className="text-sm text-slate-400">View dashboards and chat with AI for personalized tips</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 pb-20">
        <div className="max-w-7xl mx-auto text-center bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Optimize Your Energy?</h2>
          <p className="text-blue-100 mb-8 text-lg">Start saving money and reducing your environmental impact today.</p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105 inline-flex items-center gap-2"
          >
            View Your Dashboard
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your Powerlytics AI assistant. Ask me about your energy usage, costs, or get recommendations on when to run appliances.' }
  ]);
  const [input, setInput] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const getAIResponse = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    // Usage and consumption questions
    if (lowerQuestion.includes('usage') && (lowerQuestion.includes('high') || lowerQuestion.includes('yesterday') || lowerQuestion.includes('spike'))) {
      return 'Your usage was high yesterday (45 kWh vs forecasted 41 kWh) due to increased HVAC activity between 2-6 PM when outdoor temperature reached 92°F. This is 10% above your typical Wednesday consumption.';
    }
    
    if (lowerQuestion.includes('usage') && lowerQuestion.includes('today')) {
      return 'Today\'s usage is currently at 18.5 kWh, tracking 5% below your typical daily pattern. You\'re on pace for about 39 kWh total, which would save you approximately $0.80 compared to yesterday.';
    }
    
    if (lowerQuestion.includes('usage') && lowerQuestion.includes('week')) {
      return 'This week you\'ve used 273 kWh total, which is 8% lower than last week (297 kWh). You\'ve saved $5.12 this week! Your best day was Saturday with only 33 kWh.';
    }
    
    // Cost and savings questions
    if (lowerQuestion.includes('cost') || lowerQuestion.includes('bill') || lowerQuestion.includes('spend')) {
      return 'Your current energy cost this week is $41.38, down 12% from last week ($47.02). At this rate, your monthly bill will be approximately $177, compared to your average of $195. You\'re saving about $18/month!';
    }
    
    if (lowerQuestion.includes('save') && (lowerQuestion.includes('money') || lowerQuestion.includes('how'))) {
      return 'Here are my top 3 savings tips: 1) Shift dishwasher/laundry to 11PM-6AM (save $12/month), 2) Raise thermostat 2°F during 2-6PM peak hours (save $8/month), 3) Use timer for pool pump during off-peak hours (save $6/month). Total potential savings: $26/month!';
    }
    
    // Appliance timing questions
    if ((lowerQuestion.includes('dishwasher') || lowerQuestion.includes('appliance') || lowerQuestion.includes('laundry')) && (lowerQuestion.includes('when') || lowerQuestion.includes('time') || lowerQuestion.includes('cheapest'))) {
      return 'The cheapest time to run your dishwasher is between 2:00 AM - 6:00 AM when rates drop to $0.08/kWh. Based on your patterns, 11:00 PM - 1:00 AM is also good at $0.15/kWh and more convenient. Running during peak hours (2-8 PM) costs $0.28/kWh - that\'s 3.5x more expensive!';
    }
    
    if (lowerQuestion.includes('air conditioning') || lowerQuestion.includes('ac') || lowerQuestion.includes('hvac') || lowerQuestion.includes('thermostat')) {
      return 'Your HVAC system accounts for 42% of your energy usage. I recommend: Set thermostat to 76°F during day, 72°F at night. Raise it by 2-3°F during peak hours (2-6 PM) to save $8-12/month. Your system runs most efficiently when maintaining consistent temperatures rather than large swings.';
    }
    
    // Forecast and prediction questions
    if (lowerQuestion.includes('forecast') || lowerQuestion.includes('tomorrow') || lowerQuestion.includes('predict')) {
      return 'Tomorrow\'s forecast shows you\'ll likely use 38 kWh (normal range: 35-42 kWh). Weather will be sunny and 78°F, so expect moderate AC usage. This should cost around $5.70. Pro tip: The weather is perfect for running heat-generating appliances (oven, dryer) in the evening when it cools down.';
    }
    
    // Anomaly and alerts
    if (lowerQuestion.includes('anomaly') || lowerQuestion.includes('alert') || lowerQuestion.includes('wrong') || lowerQuestion.includes('unusual')) {
      return 'I detected 1 anomaly this week: Wednesday showed 10% higher usage than predicted during 2-6 PM. Analysis indicates this was due to outdoor temperature reaching 92°F, causing increased HVAC runtime. This was a normal response to weather conditions, not a system malfunction.';
    }
    
    // Solar and renewable energy
    if (lowerQuestion.includes('solar') || lowerQuestion.includes('renewable')) {
      return 'Based on your consumption patterns, installing solar panels could save you $85-120/month. Your roof receives optimal sunlight during 9AM-4PM. A 5kW system would cover approximately 65% of your energy needs. Expected payback period: 7-9 years with current incentives.';
    }
    
    // Peak hours
    if (lowerQuestion.includes('peak') && lowerQuestion.includes('hours')) {
      return 'Peak hours in your area are 2:00 PM - 8:00 PM when rates are highest ($0.28/kWh). Off-peak is 11:00 PM - 7:00 AM ($0.08-0.12/kWh). Mid-peak is 7:00 AM - 2:00 PM and 8:00 PM - 11:00 PM ($0.15/kWh). Shifting just 20% of your usage to off-peak could save $15-20/month.';
    }
    
    // Comparison questions
    if (lowerQuestion.includes('compare') || lowerQuestion.includes('average') || lowerQuestion.includes('neighbors')) {
      return 'Your household uses about 39 kWh/day, which is 8% below the average for similar-sized homes in your area (42 kWh/day). You\'re doing great! Top 25% of efficient homes use around 35 kWh/day. You could reach that with a few more optimizations.';
    }
    
    // Device-specific questions
    if (lowerQuestion.includes('fridge') || lowerQuestion.includes('refrigerator')) {
      return 'Your refrigerator uses approximately 3.2 kWh/day ($0.48/day or $14.40/month). This is within normal range. To optimize: Keep it at 37°F, freezer at 0°F. Clean coils every 6 months. A new Energy Star model could save $30-40/year.';
    }
    
    if (lowerQuestion.includes('water heater')) {
      return 'Your water heater uses about 8-12 kWh/day ($1.20-1.80/day). Tips: Set to 120°F, insulate the tank and pipes, use cold water for laundry when possible. Consider a timer to heat water during off-peak hours only - potential savings: $10-15/month.';
    }
    
    // General help
    if (lowerQuestion.includes('help') || lowerQuestion.includes('what can you')) {
      return 'I can help you with: 📊 Usage analysis (today, weekly, monthly), 💰 Cost tracking and savings tips, ⏰ Best times to run appliances, 🔮 Energy forecasts, ⚠️ Anomaly explanations, 🏠 Device-specific advice, 🌞 Solar potential, 📈 Comparison with similar homes. Just ask me anything!';
    }
    
    // Default response with suggestions
    return `I'm here to help with your energy questions! Here are some things you can ask me:

• "Why was my usage high yesterday?"
• "When is the cheapest time to run my dishwasher?"
• "How much am I spending on energy?"
• "What's tomorrow's forecast?"
• "How can I save money?"
• "Tell me about the anomaly"
• "When are peak hours?"

What would you like to know?`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      const response = getAIResponse(input);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8 text-blue-400" />
              <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded">-8%</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">273 kWh</div>
            <div className="text-sm text-slate-400">This Week</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-emerald-400" />
              <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded">-12%</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">$41.38</div>
            <div className="text-sm text-slate-400">Energy Cost</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-cyan-400" />
              <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-1 rounded">Forecast</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">38 kWh</div>
            <div className="text-sm text-slate-400">Tomorrow</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-amber-500/20">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
              <span className="text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded">Alert</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">1</div>
            <div className="text-sm text-slate-400">Anomaly Detected</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Today's Consumption Pattern
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" label={{ value: 'kWh', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #3b82f6', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="consumption" stroke="#3b82f6" fillOpacity={1} fill="url(#colorConsumption)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              Weekly Usage vs Forecast
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" label={{ value: 'kWh', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #3b82f6', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="consumption" fill="#3b82f6" name="Actual" />
                <Bar dataKey="forecast" fill="#06b6d4" name="Forecast" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-lg font-semibold text-white mb-4">AI Insights</h3>
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-amber-300 mb-1">Anomaly Detected - Wednesday</div>
                    <div className="text-sm text-slate-300">Usage was 10% higher than predicted. Peak consumption during 2-6 PM likely due to HVAC usage.</div>
                  </div>
                </div>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-300 mb-1">Great Week!</div>
                    <div className="text-sm text-slate-300">You've reduced consumption by 8% compared to last week, saving $5.12.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>
            <div className="space-y-3">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="font-medium text-blue-300 mb-2">💡 Shift Heavy Appliances</div>
                <div className="text-sm text-slate-300 mb-2">Run dishwasher and laundry between 11 PM - 6 AM to save ~$12/month</div>
                <div className="text-xs text-blue-400">Off-peak rates: $0.08/kWh</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="font-medium text-blue-300 mb-2">🌡️ Optimize Thermostat</div>
                <div className="text-sm text-slate-300 mb-2">Raise temperature by 2°F during 2-6 PM peak hours</div>
                <div className="text-xs text-blue-400">Potential savings: $8/month</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Chat Widget */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-slate-800 rounded-2xl shadow-2xl border border-blue-500/30 overflow-hidden z-50">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-white" />
              <h3 className="font-semibold text-white">AI Assistant</h3>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="h-96 overflow-y-auto p-4 space-y-3 bg-slate-900">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-slate-100'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-slate-100 rounded-lg p-3 text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-blue-500/20 p-3 bg-slate-800">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-slate-900 text-white text-sm rounded-lg px-3 py-2 border border-blue-500/30 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setInput("Why was my usage high yesterday?")}
                className="text-xs bg-slate-900 hover:bg-slate-700 text-blue-300 px-2 py-1 rounded-full transition-colors"
              >
                Usage spike?
              </button>
              <button
                onClick={() => setInput("When is the cheapest time to run my dishwasher?")}
                className="text-xs bg-slate-900 hover:bg-slate-700 text-blue-300 px-2 py-1 rounded-full transition-colors"
              >
                Best time?
              </button>
              <button
                onClick={() => setInput("How can I save money?")}
                className="text-xs bg-slate-900 hover:bg-slate-700 text-blue-300 px-2 py-1 rounded-full transition-colors"
              >
                Save money?
              </button>
              <button
                onClick={() => setInput("What's tomorrow's forecast?")}
                className="text-xs bg-slate-900 hover:bg-slate-700 text-blue-300 px-2 py-1 rounded-full transition-colors"
              >
                Forecast?
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Widget Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full p-4 shadow-2xl shadow-blue-500/50 transition-all transform hover:scale-110 z-40"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div>
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-lg border-b border-blue-500/30 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Powerlytics</h1>
                <p className="text-xs text-blue-300">AI-Powered Energy Intelligence</p>
              </div>
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage('home')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 'home'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Home className="w-4 h-4 inline mr-2" />
                Home
              </button>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      {currentPage === 'home' ? (
        <HomePage onNavigate={setCurrentPage} />
      ) : (
        <DashboardPage />
      )}
    </div>
  );
}
