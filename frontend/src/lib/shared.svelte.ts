export const userState = $state<{ user: { userID: string; user: string; nickname: string | null } | null} >({
	user: null
});

export const locationState = $state<{ location: { latitude: number; longitude: number; view: number } }>({
	location: {
		latitude: 50.8464487,
		longitude: 8.0954997,
		view: 5.5
	}
});

export const exampleMarkerState = $state<{ isOn: boolean }>({
	isOn: false
});