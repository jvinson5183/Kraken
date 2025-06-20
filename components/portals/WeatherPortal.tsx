import React, { useEffect, useState, useRef, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Cloud, 
  CloudRain,
  CloudSnow,
  Sun,
  CloudDrizzle,
  Zap,
  Wind,
  Thermometer,
  Droplets,
  Eye,
  Gauge,
  Compass,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  Download,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Satellite,
  BarChart3
} from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'

// Tel Aviv coordinates for demo
const TEL_AVIV_COORDS = { lat: 32.0853, lon: 34.7818 }

interface WeatherData {
  location: string
  coordinates: { lat: number; lon: number }
  current: {
    temperature: number
    humidity: number
    windSpeed: number
    windDirection: number
    pressure: number
    visibility: number
    uvIndex: number
    conditions: string
    icon: string
    lastUpdated: Date
  }
  forecast: {
    hourly: Array<{
      time: Date
      temperature: number
      humidity: number
      windSpeed: number
      windDirection: number
      precipitationChance: number
      conditions: string
      icon: string
    }>
    daily: Array<{
      date: Date
      high: number
      low: number
      humidity: number
      windSpeed: number
      windDirection: number
      precipitationChance: number
      conditions: string
      icon: string
    }>
  }
  alerts: Array<{
    id: string
    type: 'warning' | 'watch' | 'advisory'
    severity: 'extreme' | 'severe' | 'moderate' | 'minor'
    title: string
    description: string
    startTime: Date
    endTime: Date
    area: string
  }>
}

interface WeatherPortalProps {
  level: 2 | 3
  onLevelChange?: (level: 2 | 3) => void
  onClose?: () => void
}

interface WeatherSettings {
  units: 'metric' | 'imperial'
  refreshInterval: number
  alertsEnabled: boolean
  location: string
  showHourlyForecast: boolean
  showSatelliteData: boolean
}

// Weather Portal Context
interface WeatherPortalContextType {
  weatherData: WeatherData
  setWeatherData: (data: WeatherData) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  lastUpdated: Date
  setLastUpdated: (date: Date) => void
  settings: WeatherSettings
  setSettings: (settings: WeatherSettings | ((prev: WeatherSettings) => WeatherSettings)) => void
  refreshWeatherData: () => Promise<void>
  updateLocationWeather: (location: string) => Promise<void>
}

const WeatherPortalContext = createContext<WeatherPortalContextType | null>(null)

// Sample weather data for Tel Aviv
const SAMPLE_WEATHER_DATA: WeatherData = {
  location: 'Tel Aviv, Israel',
  coordinates: TEL_AVIV_COORDS,
  current: {
    temperature: 24,
    humidity: 65,
    windSpeed: 15,
    windDirection: 290,
    pressure: 1013,
    visibility: 10,
    uvIndex: 6,
    conditions: 'Partly Cloudy',
    icon: 'partly-cloudy',
    lastUpdated: new Date()
  },
  forecast: {
    hourly: [
      {
        time: new Date(Date.now() + 1 * 60 * 60 * 1000),
        temperature: 25,
        humidity: 60,
        windSpeed: 12,
        windDirection: 280,
        precipitationChance: 10,
        conditions: 'Sunny',
        icon: 'sunny'
      },
      {
        time: new Date(Date.now() + 2 * 60 * 60 * 1000),
        temperature: 26,
        humidity: 55,
        windSpeed: 10,
        windDirection: 270,
        precipitationChance: 5,
        conditions: 'Clear',
        icon: 'clear'
      },
      {
        time: new Date(Date.now() + 3 * 60 * 60 * 1000),
        temperature: 27,
        humidity: 50,
        windSpeed: 8,
        windDirection: 260,
        precipitationChance: 0,
        conditions: 'Sunny',
        icon: 'sunny'
      },
      {
        time: new Date(Date.now() + 4 * 60 * 60 * 1000),
        temperature: 28,
        humidity: 45,
        windSpeed: 12,
        windDirection: 250,
        precipitationChance: 15,
        conditions: 'Partly Cloudy',
        icon: 'partly-cloudy'
      },
      {
        time: new Date(Date.now() + 5 * 60 * 60 * 1000),
        temperature: 26,
        humidity: 60,
        windSpeed: 15,
        windDirection: 240,
        precipitationChance: 30,
        conditions: 'Cloudy',
        icon: 'cloudy'
      },
      {
        time: new Date(Date.now() + 6 * 60 * 60 * 1000),
        temperature: 24,
        humidity: 70,
        windSpeed: 18,
        windDirection: 230,
        precipitationChance: 45,
        conditions: 'Light Rain',
        icon: 'light-rain'
      }
    ],
    daily: [
      {
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        high: 28,
        low: 20,
        humidity: 65,
        windSpeed: 15,
        windDirection: 280,
        precipitationChance: 20,
        conditions: 'Partly Cloudy',
        icon: 'partly-cloudy'
      },
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        high: 30,
        low: 22,
        humidity: 60,
        windSpeed: 12,
        windDirection: 270,
        precipitationChance: 10,
        conditions: 'Sunny',
        icon: 'sunny'
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        high: 26,
        low: 18,
        humidity: 75,
        windSpeed: 20,
        windDirection: 260,
        precipitationChance: 60,
        conditions: 'Rainy',
        icon: 'rainy'
      },
      {
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        high: 29,
        low: 21,
        humidity: 55,
        windSpeed: 10,
        windDirection: 250,
        precipitationChance: 5,
        conditions: 'Clear',
        icon: 'clear'
      },
      {
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        high: 27,
        low: 19,
        humidity: 70,
        windSpeed: 16,
        windDirection: 240,
        precipitationChance: 40,
        conditions: 'Cloudy',
        icon: 'cloudy'
      },
      {
        date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        high: 25,
        low: 17,
        humidity: 80,
        windSpeed: 22,
        windDirection: 230,
        precipitationChance: 70,
        conditions: 'Stormy',
        icon: 'stormy'
      },
      {
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        high: 31,
        low: 23,
        humidity: 50,
        windSpeed: 8,
        windDirection: 220,
        precipitationChance: 0,
        conditions: 'Sunny',
        icon: 'sunny'
      }
    ]
  },
  alerts: [
    {
      id: 'alert-1',
      type: 'warning',
      severity: 'moderate',
      title: 'High Temperature Advisory',
      description: 'Temperatures expected to reach 35°C (95°F) today. Stay hydrated and avoid prolonged sun exposure.',
      startTime: new Date(),
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
      area: 'Central Israel'
    }
  ]
}

// Weather Portal Context Provider
export const WeatherPortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherData>(SAMPLE_WEATHER_DATA)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [settings, setSettings] = useState<WeatherSettings>({
    units: 'metric',
    refreshInterval: 300000, // 5 minutes
    alertsEnabled: true,
    location: 'Tel Aviv, Israel',
    showHourlyForecast: true,
    showSatelliteData: false
  })

  // Initial weather data fetch
  useEffect(() => {
    refreshWeatherData()
  }, [])

  // Auto-refresh weather data
  useEffect(() => {
    const interval = setInterval(() => {
      refreshWeatherData()
    }, settings.refreshInterval)

    return () => clearInterval(interval)
  }, [settings.refreshInterval])

  const refreshWeatherData = async () => {
    setIsLoading(true)
    try {
      const newWeatherData = await fetchNOAAWeatherData(settings.location)
      if (newWeatherData) {
        setWeatherData(newWeatherData)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Error refreshing weather data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateLocationWeather = async (newLocation: string) => {
    setIsLoading(true)
    try {
      const newWeatherData = await fetchNOAAWeatherData(newLocation)
      if (newWeatherData) {
        setWeatherData(newWeatherData)
        setSettings(prev => ({ ...prev, location: newLocation }))
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Error updating location weather:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const contextValue: WeatherPortalContextType = {
    weatherData,
    setWeatherData,
    isLoading,
    setIsLoading,
    lastUpdated,
    setLastUpdated,
    settings,
    setSettings,
    refreshWeatherData,
    updateLocationWeather
  }

  return (
    <WeatherPortalContext.Provider value={contextValue}>
      {children}
    </WeatherPortalContext.Provider>
  )
}

// Hook to use weather portal context
const useWeatherPortal = () => {
  const context = useContext(WeatherPortalContext)
  if (!context) {
    throw new Error('useWeatherPortal must be used within a WeatherPortalProvider')
  }
  return context
}

const getWeatherIcon = (condition: string, size: 'sm' | 'md' | 'lg' = 'md') => {
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'
  
  switch (condition.toLowerCase()) {
    case 'sunny':
    case 'clear':
      return <Sun className={`${iconSize} text-yellow-400`} />
    case 'partly-cloudy':
      return <Cloud className={`${iconSize} text-gray-300`} />
    case 'cloudy':
      return <Cloud className={`${iconSize} text-gray-400`} />
    case 'light-rain':
    case 'drizzle':
      return <CloudDrizzle className={`${iconSize} text-blue-400`} />
    case 'rain':
      return <CloudRain className={`${iconSize} text-blue-500`} />
    case 'heavy-rain':
      return <CloudRain className={`${iconSize} text-blue-600`} />
    case 'thunderstorms':
      return <Zap className={`${iconSize} text-purple-400`} />
    case 'snow':
      return <CloudSnow className={`${iconSize} text-white`} />
    default:
      return <Cloud className={`${iconSize} text-gray-300`} />
  }
}

const getWindDirection = (degrees: number) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

const getAlertSeverityColor = (severity: string) => {
  switch (severity) {
    case 'extreme':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    case 'severe':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    case 'moderate':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'minor':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

const convertTemperature = (celsius: number, toUnit: 'metric' | 'imperial'): number => {
  if (toUnit === 'imperial') {
    return Math.round((celsius * 9/5) + 32)
  }
  return celsius
}

const convertSpeed = (kmh: number, toUnit: 'metric' | 'imperial'): number => {
  if (toUnit === 'imperial') {
    return Math.round(kmh * 0.621371)
  }
  return kmh
}

const getTemperatureUnit = (units: 'metric' | 'imperial'): string => {
  return units === 'metric' ? '°C' : '°F'
}

const getSpeedUnit = (units: 'metric' | 'imperial'): string => {
  return units === 'metric' ? 'km/h' : 'mph'
}

// NOAA API Integration Functions
const geocodeLocation = async (location: string): Promise<{ lat: number; lon: number } | null> => {
  try {
    // First try with Nominatim (OpenStreetMap) - free geocoding service
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
      {
        headers: {
          'User-Agent': '(Kraken Weather Portal, contact@example.com)'
        }
      }
    )
    
    if (response.ok) {
      const data = await response.json()
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }
      }
    }
    
    // Fallback to hardcoded coordinates for common locations
    const locationMap: { [key: string]: { lat: number; lon: number } } = {
      'tel aviv, israel': { lat: 32.0853, lon: 34.7818 },
      'tel aviv': { lat: 32.0853, lon: 34.7818 },
      'new york, ny': { lat: 40.7128, lon: -74.0060 },
      'new york': { lat: 40.7128, lon: -74.0060 },
      'london, uk': { lat: 51.5074, lon: -0.1278 },
      'london': { lat: 51.5074, lon: -0.1278 },
      'tokyo, japan': { lat: 35.6762, lon: 139.6503 },
      'tokyo': { lat: 35.6762, lon: 139.6503 },
      'paris, france': { lat: 48.8566, lon: 2.3522 },
      'paris': { lat: 48.8566, lon: 2.3522 },
      'sydney, australia': { lat: -33.8688, lon: 151.2093 },
      'sydney': { lat: -33.8688, lon: 151.2093 },
      'washington, dc': { lat: 38.9072, lon: -77.0369 },
      'los angeles, ca': { lat: 34.0522, lon: -118.2437 },
      'chicago, il': { lat: 41.8781, lon: -87.6298 },
      'miami, fl': { lat: 25.7617, lon: -80.1918 }
    }
    
    const normalized = location.toLowerCase().trim()
    return locationMap[normalized] || { lat: 32.0853, lon: 34.7818 } // Default to Tel Aviv
    
  } catch (error) {
    console.error('Geocoding error:', error)
    return { lat: 32.0853, lon: 34.7818 } // Default to Tel Aviv
  }
}

const fetchNOAAWeatherData = async (location: string): Promise<WeatherData | null> => {
  try {
    // Get coordinates for the location
    const coords = await geocodeLocation(location)
    if (!coords) return null

    // Fetch NOAA grid point information
    const pointResponse = await fetch(
      `https://api.weather.gov/points/${coords.lat},${coords.lon}`,
      {
        headers: {
          'User-Agent': '(Kraken Weather Portal, contact@example.com)'
        }
      }
    )

    if (!pointResponse.ok) {
      throw new Error('Failed to fetch NOAA grid point data')
    }

    const pointData = await pointResponse.json()
    
    // Fetch current observations from nearest station
    const stationsResponse = await fetch(pointData.properties.observationStations, {
      headers: {
        'User-Agent': '(Kraken Weather Portal, contact@example.com)'
      }
    })
    
    let currentWeather = null
    if (stationsResponse.ok) {
      const stationsData = await stationsResponse.json()
      if (stationsData.features && stationsData.features.length > 0) {
        const nearestStation = stationsData.features[0].properties.stationIdentifier
        
        const obsResponse = await fetch(
          `https://api.weather.gov/stations/${nearestStation}/observations/latest`,
          {
            headers: {
              'User-Agent': '(Kraken Weather Portal, contact@example.com)'
            }
          }
        )
        
        if (obsResponse.ok) {
          const obsData = await obsResponse.json()
          const obs = obsData.properties
          
          currentWeather = {
            temperature: obs.temperature?.value ? Math.round(obs.temperature.value) : 25,
            humidity: obs.relativeHumidity?.value ? Math.round(obs.relativeHumidity.value) : 60,
            windSpeed: obs.windSpeed?.value ? Math.round(obs.windSpeed.value * 3.6) : 10, // Convert m/s to km/h
            windDirection: obs.windDirection?.value || 270,
            pressure: obs.barometricPressure?.value ? Math.round(obs.barometricPressure.value / 100) : 1013, // Convert Pa to hPa
            visibility: obs.visibility?.value ? Math.round(obs.visibility.value / 1000) : 10, // Convert m to km
            uvIndex: 5, // NOAA doesn't provide UV in observations
            conditions: obs.textDescription || 'Clear',
            icon: getWeatherIconFromDescription(obs.textDescription || 'Clear'),
            lastUpdated: new Date()
          }
        }
      }
    }

    // Fetch forecast data
    const forecastResponse = await fetch(pointData.properties.forecast, {
      headers: {
        'User-Agent': '(Kraken Weather Portal, contact@example.com)'
      }
    })
    
    const hourlyForecastResponse = await fetch(pointData.properties.forecastHourly, {
      headers: {
        'User-Agent': '(Kraken Weather Portal, contact@example.com)'
      }
    })

    let forecastData = { hourly: [], daily: [] }
    
    if (hourlyForecastResponse.ok) {
      const hourlyData = await hourlyForecastResponse.json()
      forecastData.hourly = hourlyData.properties.periods.slice(0, 24).map((period: any) => ({
        time: new Date(period.startTime),
        temperature: period.temperature || 25,
        humidity: period.relativeHumidity?.value || 60,
        windSpeed: Math.round((period.windSpeed?.replace(/\D/g, '') || 10) * 1.6), // Convert mph to km/h approximation
        windDirection: 270,
        precipitationChance: period.probabilityOfPrecipitation?.value || 0,
        conditions: period.shortForecast || 'Clear',
        icon: getWeatherIconFromDescription(period.shortForecast || 'Clear')
      }))
    }

    if (forecastResponse.ok) {
      const dailyData = await forecastResponse.json()
      forecastData.daily = dailyData.properties.periods.slice(0, 14).map((period: any, index: number) => ({
        date: new Date(Date.now() + index * 24 * 60 * 60 * 1000),
        high: period.temperature || 28,
        low: period.temperature ? period.temperature - 8 : 20,
        humidity: 65,
        windSpeed: Math.round((period.windSpeed?.replace(/\D/g, '') || 10) * 1.6),
        windDirection: 270,
        precipitationChance: period.probabilityOfPrecipitation?.value || 0,
        conditions: period.shortForecast || 'Clear',
        icon: getWeatherIconFromDescription(period.shortForecast || 'Clear')
      }))
    }

    // Fetch weather alerts
    const alertsResponse = await fetch(
      `https://api.weather.gov/alerts/active?point=${coords.lat},${coords.lon}`,
      {
        headers: {
          'User-Agent': '(Kraken Weather Portal, contact@example.com)'
        }
      }
    )

    let alerts = []
    if (alertsResponse.ok) {
      const alertsData = await alertsResponse.json()
      alerts = alertsData.features.slice(0, 5).map((alert: any, index: number) => ({
        id: `alert-${index}`,
        type: alert.properties.event?.toLowerCase().includes('warning') ? 'warning' : 'watch',
        severity: alert.properties.severity?.toLowerCase() || 'moderate',
        title: alert.properties.event || 'Weather Alert',
        description: alert.properties.description || 'Weather alert in effect',
        startTime: new Date(alert.properties.effective || Date.now()),
        endTime: new Date(alert.properties.expires || Date.now() + 24 * 60 * 60 * 1000),
        area: alert.properties.areaDesc || location
      }))
    }

    return {
      location,
      coordinates: coords,
      current: currentWeather || {
        temperature: 25,
        humidity: 60,
        windSpeed: 10,
        windDirection: 270,
        pressure: 1013,
        visibility: 10,
        uvIndex: 5,
        conditions: 'Clear',
        icon: 'clear',
        lastUpdated: new Date()
      },
      forecast: forecastData,
      alerts
    }

  } catch (error) {
    console.error('Error fetching NOAA weather data:', error)
    return null
  }
}

const getWeatherIconFromDescription = (description: string): string => {
  const desc = description.toLowerCase()
  if (desc.includes('sunny') || desc.includes('clear')) return 'sunny'
  if (desc.includes('partly cloudy') || desc.includes('partly sunny')) return 'partly-cloudy'
  if (desc.includes('cloudy') || desc.includes('overcast')) return 'cloudy'
  if (desc.includes('rain') && desc.includes('heavy')) return 'heavy-rain'
  if (desc.includes('rain')) return 'rain'
  if (desc.includes('drizzle')) return 'drizzle'
  if (desc.includes('thunderstorm') || desc.includes('storm')) return 'thunderstorms'
  if (desc.includes('snow')) return 'snow'
  return 'clear'
}

const WeatherPortal: React.FC<WeatherPortalProps> = ({ level, onLevelChange, onClose }) => {
  const { weatherData, isLoading, lastUpdated, settings, setSettings, refreshWeatherData, updateLocationWeather } = useWeatherPortal()

  const exportWeatherData = () => {
    const data = JSON.stringify(weatherData, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `weather-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (level === 2) {
    return (
      <div className="flex flex-col h-full bg-gray-900/90 text-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-purple-300">{settings.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {convertTemperature(weatherData.current.temperature, settings.units)}{getTemperatureUnit(settings.units)}
            </Badge>
            {weatherData.alerts.length > 0 && (
              <Badge className={getAlertSeverityColor(weatherData.alerts[0].severity)}>
                {weatherData.alerts.length} Alert{weatherData.alerts.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>

        {/* Current Conditions */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              {getWeatherIcon(weatherData.current.icon, 'lg')}
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {convertTemperature(weatherData.current.temperature, settings.units)}{getTemperatureUnit(settings.units)}
                </div>
                <div className="text-sm text-gray-300">
                  {weatherData.current.conditions}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">
                Updated {formatTime(weatherData.current.lastUpdated)}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="bg-gray-800/50 rounded-lg p-2">
              <div className="flex items-center space-x-1">
                <Droplets className="w-3 h-3 text-blue-400" />
                <span className="text-gray-300">Humidity</span>
              </div>
              <div className="text-blue-400 font-medium">{weatherData.current.humidity}%</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2">
              <div className="flex items-center space-x-1">
                <Wind className="w-3 h-3 text-green-400" />
                <span className="text-gray-300">Wind</span>
              </div>
              <div className="text-green-400 font-medium">
                {convertSpeed(weatherData.current.windSpeed, settings.units)} {getSpeedUnit(settings.units)} {getWindDirection(weatherData.current.windDirection)}
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2">
              <div className="flex items-center space-x-1">
                <Gauge className="w-3 h-3 text-purple-400" />
                <span className="text-gray-300">Pressure</span>
              </div>
              <div className="text-purple-400 font-medium">{weatherData.current.pressure} hPa</div>
            </div>
          </div>
        </div>

        {/* 6-Hour Forecast */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">6-Hour Forecast</span>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-600 hover:bg-gray-800"
              onClick={refreshWeatherData}
              disabled={isLoading}
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          <div className="space-y-2">
            {weatherData.forecast.hourly.map((hour, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="flex items-center space-x-3">
                  {getWeatherIcon(hour.icon, 'sm')}
                  <div>
                    <div className="text-sm font-medium text-gray-200">
                      {formatTime(hour.time)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {hour.conditions}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-400">
                    {convertTemperature(hour.temperature, settings.units)}{getTemperatureUnit(settings.units)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {hour.precipitationChance}% rain
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Weather Alerts */}
        {weatherData.alerts.length > 0 && (
          <div className="border-t border-gray-700 p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-400">Active Alerts</span>
            </div>
            <div className="space-y-2">
              {weatherData.alerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className={`p-2 rounded-lg border ${getAlertSeverityColor(alert.severity)}`}>
                  <div className="text-sm font-medium">{alert.title}</div>
                  <div className="text-xs opacity-75">{alert.area}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Level 3 Implementation
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col h-full bg-gray-900/95 text-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div>
              <h2 className="text-xl font-bold text-purple-300">{settings.location}</h2>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {weatherData.alerts.length > 0 && (
                <Badge className={getAlertSeverityColor(weatherData.alerts[0].severity)}>
                  {weatherData.alerts.length} Alert{weatherData.alerts.length > 1 ? 's' : ''}
                </Badge>
              )}
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Online
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 hover:bg-gray-800"
                    onClick={exportWeatherData}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export Weather Data</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 hover:bg-gray-800"
                    onClick={refreshWeatherData}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh Weather Data</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Current Conditions Card */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-purple-300 flex items-center space-x-2">
                  <Thermometer className="w-5 h-5" />
                  <span>Current Conditions</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Last updated: {formatTime(weatherData.current.lastUpdated)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    {getWeatherIcon(weatherData.current.icon, 'lg')}
                    <div>
                      <div className="text-3xl font-bold text-blue-400">
                        {convertTemperature(weatherData.current.temperature, settings.units)}{getTemperatureUnit(settings.units)}
                      </div>
                      <div className="text-lg text-gray-300">
                        {weatherData.current.conditions}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Droplets className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-gray-300">Humidity</span>
                      </div>
                      <div className="text-xl font-semibold text-blue-400">
                        {weatherData.current.humidity}%
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Wind className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-300">Wind</span>
                      </div>
                      <div className="text-xl font-semibold text-green-400">
                        {convertSpeed(weatherData.current.windSpeed, settings.units)} {getSpeedUnit(settings.units)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {getWindDirection(weatherData.current.windDirection)}
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Gauge className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-gray-300">Pressure</span>
                      </div>
                      <div className="text-xl font-semibold text-purple-400">
                        {weatherData.current.pressure} hPa
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Eye className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-gray-300">Visibility</span>
                      </div>
                      <div className="text-xl font-semibold text-cyan-400">
                        {weatherData.current.visibility} km
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 24-Hour Forecast */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-purple-300 flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>24-Hour Forecast</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-4">
                  {weatherData.forecast.hourly.map((hour, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-400 mb-2">
                        {formatTime(hour.time)}
                      </div>
                      <div className="flex justify-center mb-2">
                        {getWeatherIcon(hour.icon, 'md')}
                      </div>
                      <div className="text-lg font-medium text-blue-400 mb-1">
                        {convertTemperature(hour.temperature, settings.units)}{getTemperatureUnit(settings.units)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {hour.precipitationChance}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 7-Day Forecast */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-purple-300 flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>7-Day Forecast</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weatherData.forecast.daily.map((day, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium text-gray-200 w-16">
                          {formatDate(day.date)}
                        </div>
                        {getWeatherIcon(day.icon, 'sm')}
                        <div className="text-sm text-gray-300">
                          {day.conditions}
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="text-gray-400">Rain</div>
                          <div className="text-blue-400">{day.precipitationChance}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-400">Wind</div>
                          <div className="text-green-400">{convertSpeed(day.windSpeed, settings.units)} {getSpeedUnit(settings.units)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-blue-400 font-medium">
                            {convertTemperature(day.high, settings.units)}{getTemperatureUnit(settings.units)} / {convertTemperature(day.low, settings.units)}{getTemperatureUnit(settings.units)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weather Alerts */}
            {weatherData.alerts.length > 0 && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-300 flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Weather Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weatherData.alerts.map((alert) => (
                      <div key={alert.id} className={`p-4 rounded-lg border ${getAlertSeverityColor(alert.severity)}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-1">{alert.title}</div>
                            <div className="text-sm opacity-90 mb-2">{alert.description}</div>
                            <div className="text-xs opacity-75">
                              {alert.area} • {formatTime(alert.startTime)} - {formatTime(alert.endTime)}
                            </div>
                          </div>
                          <Badge className={`ml-2 ${getAlertSeverityColor(alert.severity)}`}>
                            {alert.type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Settings Panel */}
          <div className="w-80 border-l border-gray-700 bg-gray-800/30 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Location
                </label>
                <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter city, country"
                        value={settings.location}
                        onChange={(e) => setSettings(prev => ({ ...prev, location: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateLocationWeather(settings.location)
                          }
                        }}
                        className="bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 hover:bg-gray-800 px-3"
                        onClick={() => updateLocationWeather(settings.location)}
                        disabled={isLoading}
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Units
                </label>
                                  <Select value={settings.units} onValueChange={(value: 'metric' | 'imperial') => 
                    setSettings(prev => ({ ...prev, units: value }))
                  }>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 text-gray-100">
                    <SelectItem value="metric">Metric (°C, km/h)</SelectItem>
                    <SelectItem value="imperial">Imperial (°F, mph)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Refresh Interval
                </label>
                                  <Select value={settings.refreshInterval.toString()} onValueChange={(value) => 
                    setSettings(prev => ({ ...prev, refreshInterval: parseInt(value) }))
                  }>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 text-gray-100">
                    <SelectItem value="60000">1 minute</SelectItem>
                    <SelectItem value="300000">5 minutes</SelectItem>
                    <SelectItem value="600000">10 minutes</SelectItem>
                    <SelectItem value="1800000">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Weather Alerts</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 hover:bg-gray-800"
                    onClick={() => setSettings(prev => ({ ...prev, alertsEnabled: !prev.alertsEnabled }))}
                  >
                    {settings.alertsEnabled ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Hourly Forecast</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 hover:bg-gray-800"
                    onClick={() => setSettings(prev => ({ ...prev, showHourlyForecast: !prev.showHourlyForecast }))}
                  >
                    {settings.showHourlyForecast ? 'Show' : 'Hide'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Satellite Data</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 hover:bg-gray-800"
                    onClick={() => setSettings(prev => ({ ...prev, showSatelliteData: !prev.showSatelliteData }))}
                  >
                    {settings.showSatelliteData ? 'Show' : 'Hide'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Data Source Info */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Data Sources</h4>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center space-x-2">
                  <Satellite className="w-3 h-3" />
                  <span>NOAA Weather Service</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-3 h-3" />
                  <span>Real-time observations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>Last update: {formatTime(lastUpdated)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default WeatherPortal