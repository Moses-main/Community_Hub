interface LocationMapProps {
  className?: string;
}

export function LocationMap({ className = "" }: LocationMapProps) {
  // Google Maps embed URL for Watchman Catholic Charismatic Renewal Movement, Lagos address (using search mode - no API key required)
  const address =
    "7 Silverbird Road, Jakande First Gate, Lekki, Lagos State, Nigeria";
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div className={`w-full ${className}`}>
      <div className="container mx-auto px-4 py-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold mb-4">
            Visit Our Church
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join us for worship and fellowship at Watchman Catholic Charismatic
            Renewal Movement, Lagos. We're located in the heart of Lekki and
            would love to welcome you to our community.
          </p>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <iframe
            src={mapSrc}
            className="w-full h-96 md:h-[500px] border-0"
            style={{ minHeight: "400px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Watchman Catholic Charismatic Renewal Movement, Lagos Location"
          />

          {/* Address Info Bar */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold mb-2">
                  Watchman Catholic Charismatic Renewal Movement, Lagos
                </h3>
                <p className="opacity-90">
                  📍 7 Silverbird Road, Jakande First Gate, Lekki, Lagos State
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://maps.google.com/search/7+Silverbird+Road+Jakande+First+Gate+Lekki+Lagos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
                >
                  Get Directions
                </a>
                <a
                  href="tel:+2348000000000"
                  className="bg-white/20 text-white px-6 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors text-center"
                >
                  Call Church
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-xl">🕐</span>
            </div>
            <h4 className="font-semibold mb-2">Service Times</h4>
            <p className="text-sm text-muted-foreground">
              Sunday Service: 7:00 AM & 9:00 AM
              <br />
              Wednesday Service: 6:00 PM
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-xl">🚗</span>
            </div>
            <h4 className="font-semibold mb-2">Parking</h4>
            <p className="text-sm text-muted-foreground">
              Free parking available
              <br />
              Wheelchair accessible entrance
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-xl">👥</span>
            </div>
            <h4 className="font-semibold mb-2">First Time?</h4>
            <p className="text-sm text-muted-foreground">
              New visitor parking available
              <br />
              Welcome desk for assistance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
