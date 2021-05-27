export type LocationKey = string;

export interface ValueSet {
	Value: number;
	Unit: string;
	UnitType: number;
}

export interface LocationSet {
	ID: string;
	LocalizedName: string;
	EnglishName?: string;
}

interface DirectionSet {
	Degrees: number;
	Localized: string;
	English: string;
}

export interface IpSearchResponse {
	Version: number;
	Key: LocationKey;
	Type: string;
	Rank: number;
	LocalizedName: string;
	EnglishName: string;
	PrimaryPostalCode: string;
	Region: {
		ID: string;
		LocalizedName: string;
		EnglishName: string;
	};
	Country: {
		ID: string;
		LocalizedName: string;
		EnglishName: string;
	};
	AdministrativeArea: {
		ID: string;
		LocalizedName: string;
		EnglishName: string;
		Level: number;
		LocalizedType: string;
		EnglishType: string;
		CountryID: string;
	};
	TimeZone: {
		Code: string;
		Name: string;
		GmtOffset: number;
		IsDaylightSaving: boolean;
		NextOffsetChange: string;
	};
	GeoPosition: {
		Latitude: number;
		Longitude: number;
		Elevation: {
			Metric: ValueSet;
			Imperial: ValueSet;
		};
	};
	IsAlias: boolean;
	ParentCity?: {
		Key: LocationKey;
		LocalizedName: string;
		EnglishName: string;
	};
	SupplementalAdminAreas: Array<{
		Level: number;
		LocalizedName: string;
		EnglishName: string;
	}>;
	DataSets: string[];
	Details?: {
		Key: string;
		StationCode: string;
		StationGmtOffset: number;
		BandMap: string;
		Climo: string;
		LocalRadar: string;
		MediaRegion: string;
		Metar: string;
		NXMetro: string;
		NXState: string;
		Population: number;
		PrimaryWarningCountyCode: string;
		PrimaryWarningZoneCode: string;
		Satellite: string;
		Synoptic: string;
		MarineStation: string;
		MarineStationGMTOffset: number;
		VideoCode: string;
		PartnerID: number;
		DMA: {
			ID: string;
			EnglishName: string;
		};
		Sources: {
			DataType: string;
			Source: string;
			SourceId: number;
		};
		CanonicalPostalCode: string;
		CanonicalLocationKey: string;
		LocationStem: string;
	};
}

export type AutocompleteSearchResponse = AutocompleteSearchResult[];

export interface AutocompleteSearchResult {
	Version: number;
	Key: LocationKey;
	Type: string;
	Rank: number;
	LocalizedName: string;
	Country: {
		ID: string;
		LocalizedName: string;
	};
	AdministrativeArea: {
		ID: string;
		LocalizedName: string;
	};
}

export interface MultiDayForecastResponse {
	Headline: {
		EffectiveDate: string;
		EffectiveEpochDate: number;
		Severity: number;
		Text: string;
		Category: string;
		EndDate: string;
		EndEpochDate: number;
		MobileLink: string;
		Link: string;
	};
	DailyForecasts: Array<{
		Date: string;
		EpochDate: number;
		Sun?: {
			Rise: string;
			EpochRise: number;
			Set: string;
			EpochSet: number;
		};
		Moon?: {
			Rise: string;
			EpochRise: number;
			Set: string;
			EpochSet: number;
			Phase: string;
			Age: number;
		};
		Temperature: {
			Minimum: ValueSet;
			Maximum: ValueSet;
		};
		RealFeelTemperature?: {
			Minimum: ValueSet;
			Maximum: ValueSet;
		};
		RealFeelTemperatureShade?: {
			Minimum: ValueSet;
			Maximum: ValueSet;
		};
		HoursOfSun?: number;
		DegreeDaySummary?: {
			Heating: ValueSet;
			Cooling: ValueSet;
		};
		AirAndPollen?: {
			Name: string;
			Value: number;
			Category: string;
			CategoryValue: number;
			Type: string;
		};
		Day: {
			Icon: number;
			IconPhrase: string;
			LocalSource?: {
				Id: number;
				Name: string;
				WeatherCode: string;
			};
			ShortPhrase?: string;
			LongPhrase?: string;
			HasPrecipitation: boolean;
			PrecipitationType?: string;
			PrecipitationIntensity?: string;
			PrecipitationProbability?: number;
			ThunderstormProbability?: number;
			RainProbability?: number;
			SnowProbability?: number;
			IceProbability?: number;
			Wind?: {
				Speed: ValueSet;
				Direction: DirectionSet;
			};
			WindGust?: {
				Speed: ValueSet;
			};
			TotalLiquid?: ValueSet;
			Rain?: ValueSet;
			Snow?: ValueSet;
			Ice?: ValueSet;
			HoursOfPrecipitation?: number;
			HoursOfRain?: number;
			HoursOfSnow?: number;
			HoursOfIce?: number;
			CloudCover?: number;
		};
		Night: {
			Icon: number;
			IconPhrase: string;
			LocalSource?: {
				Id: number;
				Name: string;
				WeatherCode: string;
			};
			ShortPhrase?: string;
			LongPhrase?: string;
			HasPrecipitation: boolean;
			PrecipitationType?: string;
			PrecipitationIntensity?: string;
			PrecipitationProbability?: number;
			ThunderstormProbability?: number;
			RainProbability?: number;
			SnowProbability?: number;
			IceProbability?: number;
			Wind?: {
				Speed: ValueSet;
				Direction: DirectionSet;
			};
			WindGust?: {
				Speed: ValueSet;
			};
			TotalLiquid?: ValueSet;
			Rain?: ValueSet;
			Snow?: ValueSet;
			Ice?: ValueSet;
			HoursOfPrecipitation?: number;
			HoursOfRain?: number;
			HoursOfSnow?: number;
			HoursOfIce?: number;
			CloudCover?: number;
		};
		Sources: string[];
		MobileLink: string;
		Link: string;
	}>;
}

export type DayForecast = MultiDayForecastResponse['DailyForecasts'][number];
