export interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  sys: {
    country: string;
  };
}

export interface WeatherError {
  message: string;
}