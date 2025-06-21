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

// Common state abbreviations for better geocoding
const STATE_ABBREVIATIONS: { [key: string]: string } = {
  'al': 'alabama', 'ak': 'alaska', 'az': 'arizona', 'ar': 'arkansas', 'ca': 'california',
  'co': 'colorado', 'ct': 'connecticut', 'de': 'delaware', 'fl': 'florida', 'ga': 'georgia',
  'hi': 'hawaii', 'id': 'idaho', 'il': 'illinois', 'in': 'indiana', 'ia': 'iowa',
  'ks': 'kansas', 'ky': 'kentucky', 'la': 'louisiana', 'me': 'maine', 'md': 'maryland',
  'ma': 'massachusetts', 'mi': 'michigan', 'mn': 'minnesota', 'ms': 'mississippi', 'mo': 'missouri',
  'mt': 'montana', 'ne': 'nebraska', 'nv': 'nevada', 'nh': 'new hampshire', 'nj': 'new jersey',
  'nm': 'new mexico', 'ny': 'new york', 'nc': 'north carolina', 'nd': 'north dakota', 'oh': 'ohio',
  'ok': 'oklahoma', 'or': 'oregon', 'pa': 'pennsylvania', 'ri': 'rhode island', 'sc': 'south carolina',
  'sd': 'south dakota', 'tn': 'tennessee', 'tx': 'texas', 'ut': 'utah', 'vt': 'vermont',
  'va': 'virginia', 'wa': 'washington', 'wv': 'west virginia', 'wi': 'wisconsin', 'wy': 'wyoming'
}

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
      const newWeatherData = await fetchOpenMeteoWeatherData(settings.location)
      if (newWeatherData) {
        setWeatherData(newWeatherData)
        setLastUpdated(new Date())
      } else {
        // Fallback to sample data if API fails
        console.warn('Failed to fetch weather data, using sample data')
        setWeatherData(SAMPLE_WEATHER_DATA)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Error refreshing weather data:', error)
      // Fallback to sample data on error
      setWeatherData(SAMPLE_WEATHER_DATA)
      setLastUpdated(new Date())
    } finally {
      setIsLoading(false)
    }
  }

  const updateLocationWeather = async (newLocation: string) => {
    console.log('🌍 updateLocationWeather called with:', newLocation)
    console.log('📍 Current location was:', settings.location)
    setIsLoading(true)
    try {
      const newWeatherData = await fetchOpenMeteoWeatherData(newLocation)
      console.log('🌤️ Received weather data:', newWeatherData)
      if (newWeatherData) {
        console.log('✅ Successfully fetched weather data, updating state...')
        setWeatherData(newWeatherData)
        setSettings(prev => ({ ...prev, location: newLocation }))
        setLastUpdated(new Date())
        console.log('✅ Weather data updated successfully for:', newLocation)
        console.log('🌡️ New temperature:', newWeatherData.current.temperature)
        console.log('📍 Settings location updated to:', newLocation)
      } else {
        // Fallback to sample data if API fails, but still update location
        console.warn('⚠️ Failed to fetch weather data for new location, using sample data')
        const fallbackData = { ...SAMPLE_WEATHER_DATA, location: newLocation }
        setWeatherData(fallbackData)
        setSettings(prev => ({ ...prev, location: newLocation }))
        setLastUpdated(new Date())
        console.log('📋 Using sample data for:', newLocation)
      }
    } catch (error) {
      console.error('❌ Error updating location weather:', error)
      // Fallback to sample data on error, but still update location
      const fallbackData = { ...SAMPLE_WEATHER_DATA, location: newLocation }
      setWeatherData(fallbackData)
      setSettings(prev => ({ ...prev, location: newLocation }))
      setLastUpdated(new Date())
      console.log('📋 Error fallback data set for:', newLocation)
    } finally {
      setIsLoading(false)
      console.log('🔄 Loading state set to false')
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

// Open-Meteo API Integration Functions
const geocodeLocation = async (location: string): Promise<{ lat: number; lon: number } | null> => {
  try {
    console.log('Geocoding location:', location)
    
    // Enhanced search with more results to find the right city+state combination
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=10&language=en&format=json`
    console.log('Geocoding URL:', geocodeUrl)
    
    const response = await fetch(geocodeUrl)
    console.log('Geocoding response status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('Geocoding response data:', data)
      if (data.results && data.results.length > 0) {
        console.log(`✅ Found ${data.results.length} geocoding results`)
        
        // Always return the first result if we have results
        const bestMatch = data.results[0]
        console.log('🎯 Using first result:', bestMatch)
        
        const coords = { lat: bestMatch.latitude, lon: bestMatch.longitude }
        console.log('📍 Selected coordinates:', coords, 'for location:', `${bestMatch.name}, ${bestMatch.admin1 || ''}, ${bestMatch.country}`)
        return coords
      } else {
        console.log('No results found in geocoding response')
      }
    } else {
      console.error('Geocoding API failed with status:', response.status)
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
      'miami, fl': { lat: 25.7617, lon: -80.1918 },
      'berlin, germany': { lat: 52.5200, lon: 13.4050 },
      'madrid, spain': { lat: 40.4168, lon: -3.7038 },
      'rome, italy': { lat: 41.9028, lon: 12.4964 },
      'amsterdam, netherlands': { lat: 52.3676, lon: 4.9041 }
    }
    
    const normalized = location.toLowerCase().trim()
    return locationMap[normalized] || { lat: 32.0853, lon: 34.7818 } // Default to Tel Aviv
    
  } catch (error) {
    console.error('Geocoding error:', error)
    return { lat: 32.0853, lon: 34.7818 } // Default to Tel Aviv
  }
}

const fetchOpenMeteoWeatherData = async (location: string): Promise<WeatherData | null> => {
  try {
    console.log('Fetching weather for location:', location)
    
    // Get coordinates for the location
    const coords = await geocodeLocation(location)
    console.log('Geocoded coordinates:', coords)
    if (!coords) {
      console.error('Failed to get coordinates for location:', location)
      return null
    }

    // Fetch current and forecast weather data from Open-Meteo
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,pressure_msl,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto&forecast_days=7`
    console.log('Weather API URL:', weatherUrl)
    
    const weatherResponse = await fetch(weatherUrl)

    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch Open-Meteo weather data')
    }

    const weatherData = await weatherResponse.json()
    
    // Process current weather
    const current = weatherData.current
    const currentWeather = {
      temperature: Math.round(current.temperature_2m || 25),
      humidity: Math.round(current.relative_humidity_2m || 60),
      windSpeed: Math.round(current.wind_speed_10m || 10),
      windDirection: Math.round(current.wind_direction_10m || 270),
      pressure: Math.round(current.pressure_msl || 1013),
      visibility: 10, // Default visibility since Open-Meteo hourly has this but not current
      uvIndex: 5, // Will get from hourly data if available
      conditions: getConditionsFromWeatherCode(current.weather_code || 0),
      icon: getIconFromWeatherCode(current.weather_code || 0, current.is_day),
      lastUpdated: new Date()
    }
    
    console.log(`🌡️ Weather API returned temperature: ${currentWeather.temperature}°C for location: ${location}`)

    // Process hourly forecast (next 24 hours)
    const hourlyForecast = []
    for (let i = 1; i <= 24 && i < weatherData.hourly.time.length; i++) {
      hourlyForecast.push({
        time: new Date(weatherData.hourly.time[i]),
        temperature: Math.round(weatherData.hourly.temperature_2m[i] || 25),
        humidity: Math.round(weatherData.hourly.relative_humidity_2m[i] || 60),
        windSpeed: Math.round(weatherData.hourly.wind_speed_10m[i] || 10),
        windDirection: Math.round(weatherData.hourly.wind_direction_10m[i] || 270),
        precipitationChance: Math.round(weatherData.hourly.precipitation_probability[i] || 0),
        conditions: getConditionsFromWeatherCode(weatherData.hourly.weather_code[i] || 0),
        icon: getIconFromWeatherCode(weatherData.hourly.weather_code[i] || 0, true) // Assume day for simplicity
      })
    }

    // Process daily forecast (next 7 days)
    const dailyForecast = []
    for (let i = 1; i < weatherData.daily.time.length; i++) {
      dailyForecast.push({
        date: new Date(weatherData.daily.time[i]),
        high: Math.round(weatherData.daily.temperature_2m_max[i] || 28),
        low: Math.round(weatherData.daily.temperature_2m_min[i] || 20),
        humidity: Math.round(weatherData.hourly.relative_humidity_2m[i * 24] || 65), // Approximate from hourly
        windSpeed: Math.round(weatherData.daily.wind_speed_10m_max[i] || 15),
        windDirection: Math.round(weatherData.daily.wind_direction_10m_dominant[i] || 270),
        precipitationChance: Math.round(weatherData.daily.precipitation_probability_max[i] || 0),
        conditions: getConditionsFromWeatherCode(weatherData.daily.weather_code[i] || 0),
        icon: getIconFromWeatherCode(weatherData.daily.weather_code[i] || 0, true)
      })
    }

    // Create sample alerts (Open-Meteo doesn't provide alerts, so we'll generate some based on conditions)
    const alerts = []
    if (current.wind_speed_10m > 30) {
      alerts.push({
        id: 'wind-alert',
        type: 'warning' as const,
        severity: 'moderate' as const,
        title: 'High Wind Advisory',
        description: `Strong winds of ${Math.round(current.wind_speed_10m)} km/h are expected. Secure loose objects and be cautious when driving.`,
        startTime: new Date(),
        endTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
        area: location
      })
    }
    
    if (current.temperature_2m > 35) {
      alerts.push({
        id: 'heat-alert',
        type: 'advisory' as const,
        severity: 'minor' as const,
        title: 'High Temperature Advisory',
        description: `High temperatures of ${Math.round(current.temperature_2m)}°C are expected. Stay hydrated and avoid prolonged sun exposure.`,
        startTime: new Date(),
        endTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
        area: location
      })
    }

    const finalWeatherData = {
      location,
      coordinates: coords,
      current: currentWeather,
      forecast: {
        hourly: hourlyForecast,
        daily: dailyForecast
      },
      alerts
    }
    
    console.log(`✅ Returning weather data for ${location} with temp ${currentWeather.temperature}°C`)
    return finalWeatherData

  } catch (error) {
    console.error('Error fetching Open-Meteo weather data:', error)
    return null
  }
}

// Open-Meteo weather code to conditions mapping (WMO Weather interpretation codes)
const getConditionsFromWeatherCode = (code: number): string => {
  switch (code) {
    case 0: return 'Clear'
    case 1: return 'Mainly Clear'
    case 2: return 'Partly Cloudy'
    case 3: return 'Overcast'
    case 45: case 48: return 'Fog'
    case 51: case 53: case 55: return 'Drizzle'
    case 56: case 57: return 'Freezing Drizzle'
    case 61: case 63: case 65: return 'Rain'
    case 66: case 67: return 'Freezing Rain'
    case 71: case 73: case 75: return 'Snow'
    case 77: return 'Snow Grains'
    case 80: case 81: case 82: return 'Rain Showers'
    case 85: case 86: return 'Snow Showers'
    case 95: return 'Thunderstorm'
    case 96: case 99: return 'Thunderstorm with Hail'
    default: return 'Clear'
  }
}

// Open-Meteo weather code to icon mapping
const getIconFromWeatherCode = (code: number, isDay: boolean = true): string => {
  switch (code) {
    case 0: return isDay ? 'sunny' : 'clear'
    case 1: return isDay ? 'sunny' : 'clear'
    case 2: return 'partly-cloudy'
    case 3: return 'cloudy'
    case 45: case 48: return 'cloudy' // fog
    case 51: case 53: case 55: return 'drizzle'
    case 56: case 57: return 'drizzle' // freezing drizzle
    case 61: return 'light-rain'
    case 63: return 'rain'
    case 65: return 'heavy-rain'
    case 66: case 67: return 'rain' // freezing rain
    case 71: case 73: case 75: case 77: return 'snow'
    case 80: case 81: case 82: return 'rain'
    case 85: case 86: return 'snow'
    case 95: case 96: case 99: return 'thunderstorms'
    default: return isDay ? 'sunny' : 'clear'
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
  const [searchResults, setSearchResults] = useState<Array<{name: string, country: string, admin1: string, admin2: string, lat: number, lon: number, fullName: string}>>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const searchTimeoutRef = useRef<number | null>(null)

  // Initialize search term when settings.location changes
  useEffect(() => {
    setSearchTerm(settings.location)
  }, [settings.location])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const searchLocations = async (query: string) => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (query.length < 2) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    // Debounce the search with 300ms delay
    searchTimeoutRef.current = window.setTimeout(async () => {
      try {
        console.log('Searching for locations with query:', query)
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
        )
        
        console.log('Search response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Search response data:', data)
          if (data.results) {
            const mappedResults = data.results.map((result: any) => ({
              name: result.name,
              country: result.country || '',
              admin1: result.admin1 || '', // State/Province
              admin2: result.admin2 || '', // County/Region
              lat: result.latitude,
              lon: result.longitude,
              fullName: `${result.name}${result.admin1 ? `, ${result.admin1}` : ''}${result.country ? `, ${result.country}` : ''}`
            }))
            
            // Remove duplicates and sort by relevance
            type SearchResult = {name: string, country: string, admin1: string, admin2: string, lat: number, lon: number, fullName: string}
            const uniqueResults = mappedResults.filter((result: SearchResult, index: number, self: SearchResult[]) => {
              return index === self.findIndex((r: SearchResult) => r.lat === result.lat && r.lon === result.lon)
            }).sort((a: SearchResult, b: SearchResult) => {
              // Prioritize exact name matches and larger cities (population would be ideal but not available)
              const aExact = a.name.toLowerCase() === query.toLowerCase()
              const bExact = b.name.toLowerCase() === query.toLowerCase()
              if (aExact && !bExact) return -1
              if (!aExact && bExact) return 1
              return 0
            })
            console.log('Mapped search results:', uniqueResults)
            setSearchResults(uniqueResults)
            setShowSearchResults(true)
          } else {
            console.log('No results found in search response')
            setSearchResults([])
            setShowSearchResults(false)
          }
        } else {
          console.error('Search request failed with status:', response.status)
        }
      } catch (error) {
        console.error('Search error:', error)
      }
    }, 300)
  }

  const selectSearchResult = (result: {name: string, country: string, admin1: string, admin2: string, fullName: string}) => {
    console.log('Selected search result:', result)
    const locationName = result.fullName
    setSearchTerm('') // Clear search term so input shows the actual location
    updateLocationWeather(locationName)
    setShowSearchResults(false)
    setSearchResults([])
  }

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

        {/* Quick Location Selector for Level 2 */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex gap-2 items-center">
            <Select 
              value={settings.location} 
              onValueChange={(value) => {
                console.log('Level 2 dropdown: Changing location to:', value)
                setSearchTerm('') // Clear search term when using dropdown
                updateLocationWeather(value)
              }}
            >
              <SelectTrigger className="flex-1 bg-gray-800 border-gray-600 text-gray-100 text-sm">
                <SelectValue placeholder="Change location..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-gray-100">
                <SelectItem value="Tel Aviv, Israel">Tel Aviv, Israel</SelectItem>
                <SelectItem value="New York, NY">New York, NY</SelectItem>
                <SelectItem value="London, UK">London, UK</SelectItem>
                <SelectItem value="Tokyo, Japan">Tokyo, Japan</SelectItem>
                <SelectItem value="Paris, France">Paris, France</SelectItem>
                <SelectItem value="Sydney, Australia">Sydney, Australia</SelectItem>
                <SelectItem value="Berlin, Germany">Berlin, Germany</SelectItem>
                <SelectItem value="Madrid, Spain">Madrid, Spain</SelectItem>
                <SelectItem value="Rome, Italy">Rome, Italy</SelectItem>
                <SelectItem value="Amsterdam, Netherlands">Amsterdam, Netherlands</SelectItem>
                <SelectItem value="Washington, DC">Washington, DC</SelectItem>
                <SelectItem value="Los Angeles, CA">Los Angeles, CA</SelectItem>
                <SelectItem value="Chicago, IL">Chicago, IL</SelectItem>
                <SelectItem value="Miami, FL">Miami, FL</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-600 hover:bg-gray-800"
              onClick={() => onLevelChange?.(3)}
              title="Open full settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
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
                
                {/* Quick City Selector */}
                <div className="mb-3">
                  <Select value={settings.location} onValueChange={(value) => {
                    console.log('Level 3 dropdown: Changing location to:', value)
                    setSearchTerm('') // Clear search term when using dropdown
                    updateLocationWeather(value)
                  }}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-gray-100">
                      <SelectValue placeholder="Select a city..." />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600 text-gray-100">
                      <SelectItem value="Tel Aviv, Israel">Tel Aviv, Israel</SelectItem>
                      <SelectItem value="New York, NY">New York, NY</SelectItem>
                      <SelectItem value="London, UK">London, UK</SelectItem>
                      <SelectItem value="Tokyo, Japan">Tokyo, Japan</SelectItem>
                      <SelectItem value="Paris, France">Paris, France</SelectItem>
                      <SelectItem value="Sydney, Australia">Sydney, Australia</SelectItem>
                      <SelectItem value="Berlin, Germany">Berlin, Germany</SelectItem>
                      <SelectItem value="Madrid, Spain">Madrid, Spain</SelectItem>
                      <SelectItem value="Rome, Italy">Rome, Italy</SelectItem>
                      <SelectItem value="Amsterdam, Netherlands">Amsterdam, Netherlands</SelectItem>
                      <SelectItem value="Washington, DC">Washington, DC</SelectItem>
                      <SelectItem value="Los Angeles, CA">Los Angeles, CA</SelectItem>
                      <SelectItem value="Chicago, IL">Chicago, IL</SelectItem>
                      <SelectItem value="Miami, FL">Miami, FL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Location Input with Autocomplete */}
                <div className="relative">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="text"
                        placeholder="Or enter custom city..."
                        value={searchTerm !== '' ? searchTerm : settings.location}
                        onChange={(e) => {
                          const value = e.target.value
                          setSearchTerm(value)
                          // Don't update settings.location until we actually fetch weather data
                          searchLocations(value)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const locationToUpdate = searchTerm !== '' ? searchTerm : settings.location
                            updateLocationWeather(locationToUpdate)
                            setSearchTerm('') // Clear search term after updating
                            setShowSearchResults(false)
                          } else if (e.key === 'Escape') {
                            setShowSearchResults(false)
                          }
                        }}
                        onFocus={() => {
                          if (searchResults.length > 0) {
                            setShowSearchResults(true)
                          }
                        }}
                        onBlur={() => {
                          // Delay hiding to allow click on results
                          setTimeout(() => setShowSearchResults(false), 200)
                        }}
                        className="bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
                      />
                      
                      {/* Autocomplete Results */}
                      {showSearchResults && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-64 overflow-y-auto">
                          {searchResults.map((result, index) => (
                            <div
                              key={index}
                              className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm text-gray-100 border-b border-gray-700 last:border-b-0"
                              onClick={() => selectSearchResult(result)}
                            >
                              <div className="font-medium">{result.fullName}</div>
                              <div className="text-xs text-gray-400 flex items-center justify-between">
                                <span>
                                  {result.admin2 && `${result.admin2}, `}
                                  {result.admin1 && `${result.admin1}, `}
                                  {result.country}
                                </span>
                                <span className="text-gray-500">
                                  {result.lat.toFixed(2)}, {result.lon.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 hover:bg-gray-800 px-3"
                      onClick={() => {
                        const locationToUpdate = searchTerm !== '' ? searchTerm : settings.location
                        updateLocationWeather(locationToUpdate)
                        setSearchTerm('') // Clear search term after updating
                        setShowSearchResults(false)
                      }}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
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
                  <span>Open-Meteo Weather API</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-3 h-3" />
                  <span>Global weather models</span>
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