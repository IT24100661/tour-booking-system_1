const User = require('./User');
const GuideProfile = require('./GuideProfile');
const Availability = require('./Availability');
const Booking = require('./Booking');
const Place = require('./Place');
const Hotel = require('./Hotel');
const RoomType = require('./RoomType');
const HotelReservation = require('./HotelReservation');
const Service = require('./Service');
const Favorite = require('./Favorite');
const Review = require('./Review');
const Payment = require('./Payment');

// A User can have one GuideProfile (if they are a Tour Guide)
User.hasOne(GuideProfile, { foreignKey: 'userId', as: 'guideProfile', onDelete: 'CASCADE' });
GuideProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// A User (Guide) can have multiple Availabilities
User.hasMany(Availability, { foreignKey: 'guideId', as: 'availabilities', onDelete: 'CASCADE' });
Availability.belongsTo(User, { foreignKey: 'guideId', as: 'guide' });

// A Tourist (User) can make multiple Bookings
User.hasMany(Booking, { foreignKey: 'touristId', as: 'touristBookings', onDelete: 'CASCADE' });
Booking.belongsTo(User, { foreignKey: 'touristId', as: 'tourist' });

// A Guide (User) can receive multiple Bookings
User.hasMany(Booking, { foreignKey: 'guideId', as: 'guideBookings', onDelete: 'CASCADE' });
Booking.belongsTo(User, { foreignKey: 'guideId', as: 'guide' });

// An Availability slot can optionally tie to a Booking (or just rely on dates if no explicit slot)
Booking.belongsTo(Availability, { foreignKey: 'availabilityId', as: 'bookedSlot' });
Availability.hasMany(Booking, { foreignKey: 'availabilityId' });

// A Hotel owner (User) has many Hotels
User.hasMany(Hotel, { foreignKey: 'ownerId', as: 'hotels', onDelete: 'CASCADE' });
Hotel.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// A Hotel has many RoomTypes
Hotel.hasMany(RoomType, { foreignKey: 'hotelId', as: 'roomTypes', onDelete: 'CASCADE' });
RoomType.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' });

// Hotel Reservations
User.hasMany(HotelReservation, { foreignKey: 'touristId', as: 'hotelReservations', onDelete: 'CASCADE' });
HotelReservation.belongsTo(User, { foreignKey: 'touristId', as: 'tourist' });

Hotel.hasMany(HotelReservation, { foreignKey: 'hotelId', as: 'reservations', onDelete: 'CASCADE' });
HotelReservation.belongsTo(Hotel, { foreignKey: 'hotelId', as: 'hotel' });

RoomType.hasMany(HotelReservation, { foreignKey: 'roomTypeId', as: 'reservations', onDelete: 'CASCADE' });
HotelReservation.belongsTo(RoomType, { foreignKey: 'roomTypeId', as: 'roomType' });

// Place Services
Place.hasMany(Service, { foreignKey: 'placeId', as: 'services', onDelete: 'CASCADE' });
Service.belongsTo(Place, { foreignKey: 'placeId', as: 'place' });

// User Favorites
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites', onDelete: 'CASCADE' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Place.hasMany(Favorite, { foreignKey: 'placeId', as: 'favoritedBy', onDelete: 'CASCADE' });
Favorite.belongsTo(Place, { foreignKey: 'placeId', as: 'place' });

// Reviews
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Payments
User.hasMany(Payment, { foreignKey: 'touristId', as: 'payments', onDelete: 'CASCADE' });
Payment.belongsTo(User, { foreignKey: 'touristId', as: 'tourist' });

// Basic explicit associations for easy includes (assuming constraints=false so it doesn't enforce FK on a specific table perfectly due to polymorphic usage, but we fetch via targetId anyway. We will rely on manual targetType queries.)

module.exports = {
    User,
    GuideProfile,
    Availability,
    Booking,
    Place,
    Hotel,
    RoomType,
    HotelReservation,
    Service,
    Favorite,
    Review,
    Payment
};
