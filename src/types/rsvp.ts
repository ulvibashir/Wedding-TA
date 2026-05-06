export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
}

export interface RsvpEntry {
  id: string;
  firstName: string;
  lastName: string;
  attending: boolean;
  guests: Guest[];
  submittedAt: string;
}
