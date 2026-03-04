import { IoMdClock } from "react-icons/io";
import { BiSolidCarGarage } from "react-icons/bi";
import { useBranding } from "@/hooks/use-branding";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Navigation } from "lucide-react";

interface LocationMapProps {
  className?: string;
}

export function LocationMap({ className = "" }: LocationMapProps) {
  const { data: branding } = useBranding();
  
  const churchName = branding?.churchName || "Watchman Catholic Charismatic Renewal Movement, Lagos";
  const address = branding?.churchAddress || "7 Silverbird Road, Jakande First Gate, Lekki, Lagos State, Nigeria";
  const phone = branding?.churchPhone || "+2348000000000";
  
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed&iwloc=near`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <div className={`w-full ${className} bg-white`}>
      <div className="container px-6 md:px-10 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Visit Our Church
          </h2>
          <p className="text-gray-500 text-lg">
            Join us for worship and fellowship. We're located in Lekki and would love to welcome you to our community.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <iframe
            src={mapEmbedUrl}
            className="w-full h-80 md:h-96 border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Church Location"
          />

          <div className="bg-gray-900 p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {churchName}
                </h3>
                <div className="flex items-center gap-3 text-gray-400 text-lg">
                  <MapPin className="w-5 h-5" />
                  <span>{address}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Button
                  asChild
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-lg px-8 py-4"
                >
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="w-5 h-5 mr-2" />
                    Get Directions
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl border-gray-600 text-white hover:bg-gray-800 font-medium text-lg px-8 py-4"
                >
                  <a href={`tel:${phone}`}>
                    <Phone className="w-5 h-5 mr-2" />
                    Call Church
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Card className="bg-gray-50 border-0 shadow-md rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <IoMdClock size={28} className="text-indigo-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-3 text-xl">Service Times</h4>
              <p className="text-gray-500 text-lg">
                Sunday Service: 7:00 AM & 9:00 AM
                <br />
                Wednesday Service: 6:00 PM
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 border-0 shadow-md rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <BiSolidCarGarage size={28} className="text-indigo-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-3 text-xl">Parking</h4>
              <p className="text-gray-500 text-lg">
                Free parking available
                <br />
                Wheelchair accessible entrance
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 border-0 shadow-md rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <MapPin size={28} className="text-indigo-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-3 text-xl">First Time?</h4>
              <p className="text-gray-500 text-lg">
                New visitors are highly welcomed
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 bg-gray-900 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">How to Get Here</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300">
            <div>
              <h4 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm">1</span>
                From Lekki Expressway
              </h4>
              <p className="text-lg leading-relaxed">
                Take the exit toward Jakande/Abraham Adesanya roundabout. Head toward Silverbird Galleria. Our church is located just after the first gate on the right.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm">2</span>
                From Ajah
              </h4>
              <p className="text-lg leading-relaxed">
                Head toward Lekki Phase 1, continue past the roundabout. Turn right at Silverbird Road. Look for the church sign at Jakande First Gate.
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Button
              asChild
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-lg px-8 py-4"
            >
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation className="w-5 h-5 mr-2" />
                Get Turn-by-Turn Directions
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
