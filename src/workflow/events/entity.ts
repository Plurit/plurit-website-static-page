import { formatDate } from "../../utils";

export class EventDetail {
  eventId?: string;
  eventName?: string;
  eventDescription?: string;
  eventDateAndTime?: string;
  eventDateAndTimeDisplay?: string;
  eventDuration?: number;
  eventDurationDisplay?: string;
  venue?: Venue;
  highlightImages: string[] = [];
  galleryImages: string[] = [];
  ticketAmount?: number;
  ticketLink?: string;
  supportedLanguages: string[] = [];

  artists?: string[];
  category?: string;
  subCategory?: string;
  eventType?: string;
  eventFeatures: EventFeatures;
  joinChatDetails?: JoinChatDetails;
  attendeesCount: number = 1;
  createTimestamp?: string;
  updateTimestamp?: string;

  private languageNames = new Intl.DisplayNames(["en"], {
    type: "language",
  });

  private formatDuration = (ms: number) => {
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  constructor(data: EventDetail) {
    Object.assign(this, data);

    this.venue = new Venue(data.venue || {});
    this.eventFeatures = new EventFeatures(data.eventFeatures || {});
    this.joinChatDetails = new JoinChatDetails(data.joinChatDetails || {});

    this.eventDurationDisplay =
      this.formatDuration(data.eventDuration || 0) || "";
    this.eventDateAndTimeDisplay = formatDate(data.eventDateAndTime || "");
    this.supportedLanguages = this.supportedLanguages.map((lang) => {
      const langCode = lang.split("-")[0];
      return this.languageNames.of(langCode) || "";
    });
  }
}

export class EventFeatures {
  foodAvailable?: boolean;
  smokingAllowed?: boolean;
  wheelchairAccess?: boolean;
  parkingAvailable?: boolean;
  supportAvailable?: boolean;

  petFriendly?: boolean;
  alcoholServed?: boolean;
  ticketsAtVenue?: boolean;
  washroomAvailable?: boolean;
  danceFloorAvailable?: boolean;
  poolAvailable?: boolean;

  minimumAge?: number;

  constructor(data: EventFeatures) {
    Object.assign(this, data);
  }
}

export class JoinChatDetails {
  isEnabled?: boolean;

  constructor(data: JoinChatDetails) {
    Object.assign(this, data);
  }
}

export class Venue {
  venueName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  geolocation?: Geolocation;

  fullAddressDisplay?: string;
  googleMapsLink?: string;

  constructor(data: Venue) {
    Object.assign(this, data);

    this.fullAddressDisplay = [this.venueName, this.city, this.state]
      .filter(Boolean)
      .join(", ");

    this.googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${this.geolocation?.lat},${this.geolocation?.lon}`;
  }
}

export class Geolocation {
  lat?: number;
  lon?: number;

  constructor(data: Geolocation) {
    Object.assign(this, data);
  }
}
