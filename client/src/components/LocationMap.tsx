import { IoMdClock } from "react-icons/io";
import { BiSolidCarGarage } from "react-icons/bi";
import { useBranding } from "@/hooks/use-branding";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";

interface LocationMapProps {
  className?: string;
}

export function LocationMap({ className = "" }: LocationMapProps) {
  const { data: branding } = useBranding();
  
  const churchName = branding?.churchName || "Watchman Catholic Charismatic Renewal Movement, Lagos";
  const address = branding?.churchAddress || "7 Silverbird Road, Jakande First Gate, Lekki, Lagos State, Nigeria";
  const phone = branding?.churchPhone || "+2348000000000";
  
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div className={`w-full ${className} bg-white`}>
      <div className="container px-4 md:px-6 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
            Visit Our Church
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            Join us for worship and fellowship. We're located in the heart of Lekki and would love to welcome you to our community.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft-md overflow-hidden">
          <iframe
            src={mapSrc}
            className="w-full h-80 md:h-96 border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Church Location"
          />

          <div className="bg-gray-900 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {churchName}
                </h3>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{address}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Button
                  asChild
                  className="rounded-xl bg-white text-gray-900 hover:bg-gray-100 font-medium"
                >
                  <a
                    href={`https://maps.google.com/search/${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl border-gray-700 text-white hover:bg-gray-800 font-medium"
                >
                  <a href={`tel:${phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Church
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <Card className="bg-gray-50 border-0 shadow-soft rounded-2xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <IoMdClock size={24} className="text-indigo-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Service Times</h4>
              <p className="text-sm text-gray-500">
                Sunday Service: 7:00 AM & 9:00 AM
                <br />
                Wednesday Service: 6:00 PM
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 border-0 shadow-soft rounded-2xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BiSolidCarGarage size={24} className="text-indigo-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Parking</h4>
              <p className="text-sm text-gray-500">
                Free parking available
                <br />
                Wheelchair accessible entrance
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 border-0 shadow-soft rounded-2xl">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin size={24} className="text-indigo-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">First Time?</h4>
              <p className="text-sm text-gray-500">
                New visitors are highly welcomed
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
