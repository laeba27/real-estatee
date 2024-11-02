// Create this new file to store all property data
export const saleProperties = [
    {
      id: 1,
      images: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
        "https://images.unsplash.com/photo-1600607687920-4e03c0cdc276",
        "https://images.unsplash.com/photo-1600607687644-aac76f0e23ec",
      ],
      price: 6500000,
      address: "123 MG Road, Bengaluru, Karnataka",
      beds: 3,
      baths: 2,
      homeType: "House",
      parking: 1,
      location: { lat: 12.9716, lng: 77.5946 },
      isRental: false
    },
    // ... copy all your properties from for-sale/page.jsx and add images array and isRental: false
];

export const rentProperties = [
    {
      id: 101, // Use different ID range for rent properties
      images: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
        "https://images.unsplash.com/photo-1600607687920-4e03c0cdc276",
        "https://images.unsplash.com/photo-1600607687644-aac76f0e23ec",
      ],
      price: 25000,
      address: "123 MG Road, Bengaluru, Karnataka",
      beds: 3,
      baths: 2,
      homeType: "House",
      parking: 1,
      location: { lat: 12.9716, lng: 77.5946 },
      isRental: true
    },
    // ... copy all your rent properties here
]; 