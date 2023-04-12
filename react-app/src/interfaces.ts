export interface ISearchParams {
  // Booking Info
  // les dates (début, fin) de réservationou de location
  stayStartDate?: Date,
  stayEndDate?: Date,

  // Room Info
  //  la superficie
  areaLower?: number,
  areaUpper?: number,
  //le prix des chambres
  priceLower?: number
  priceUpper?: number
  capacity?: number, // la capacité des chambres

  // Hotel Info    
  chain?: string, // la chaîne hôtelière
  category?: number, // la catégorie (rating 1-5)
  // le nombre total de chambres dans l’hôtel
  numberOfRoomsLower?: number,
  numberOfRoomsUpper?: number,

  location?: string,
}

export interface IRoom {
  roomId: number,
  hotelId: number,
  price: number,
  commodities: string,
  capacity: number,
  view: string,
  extendable: boolean,
  problems: string,
  image?: string,
}

export interface IRoomAugmented extends IRoom {
  hotelName: string,
  hotelAddress: string,
  rating: number,
  hotelChain: string,
  hotelPhoneNumber: string,
  roomImage: string,
}

export interface IUserLogin {
  email: string,
  password: string
}

export interface IUserInfo {
  NAS: string,
  email: string,
  firstName: string,
  lastName: string,
  address: string,
  password: string,
}

export interface IEmployeeInfo extends IUserInfo {
  hotelId: number,
  yearlySalary: number,
}

export interface IReservation {
  reservationId: string,
  roomId: string,
  customerNas: string,
  reservationStartDate: Date,
  reservationEndDate: Date,
  reservationDate: Date,
  guests: number,
  chainName: string,
  hotelZone: string,
  hotelAddress: string,
  hotelPhoneNumber: string,
  hotelEmail: string,
  status: string,
}

export interface IReservationEmployee extends IReservation {
  clientName: string,
  clientEmail: string,
  clientPhoneNumber: string
}

export interface IReservationInfo {
  roomId: string,
  customerNas: string,
  reservationStartDate: Date,
  reservationEndDate: Date,
  guests?: number,
}

export interface IReservedDates {
  reservationStartDate: Date,
  reservationEndDate: Date,
}

export interface IHotel {
  hotelId: number,
  chainName: string,
  email: string,
  phoneNumber: string,
  rating: number,
  managerId: string,
  zone: string,
  address: string,
}