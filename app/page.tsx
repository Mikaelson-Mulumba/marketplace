"use client";

import Image from "next/image";
import NavBar from "../components/NavBar";
import "../styles/sino-truck.css";




export default function SinoTruckPage() {

  return (
    <div className="page-container">
      <NavBar />

      {/* Hero Slider */}
      <header className="hero" role="banner">
        <div className="hero-bg">
          <Image
            src="/hero/download.png"   // ✅ pick one image path
            alt="Genuine Sino Truck Parts"
            fill
            priority
            className="hero-img"
          />
        </div>

        <div className="hero-content container">
          <h1 className="hero-title">Genuine Sino Truck Parts</h1>
          <p className="hero-sub">Trusted supplier for HOWO, A7, T7H, Sitrak</p>
          <p className="hero-sub">Keep your fleet running reliably</p>
          <a className="cta" href="/contact">Get Spare Parts</a>
        </div>
      </header>


      {/* Product Carousel */}
      <section className="cards">
        <h2>🔧 Our Spare Parts</h2>
        <div className="carousel">
          {/* Engine */}
          <div className="card">
            <div className="card-images">
              <Image src="/p/download (1).png" alt="Engine Part" width={200} height={150} style={{ height: "auto" }} />
              <Image src="/p/download (2).png" alt="Engine Installed" width={200} height={150} style={{ height: "auto" }} />
            </div>
            <h3>Engine Parts</h3>
            <p>Pistons, liners, turbochargers, injectors, starter motors.</p>
          </div>

          {/* Transmission */}
          <div className="card">
            <div className="card-images">
              <Image src="/p/download (3).png" alt="Transmission Part" width={200} height={150} style={{ height: "auto" }} />
              <Image src="/p/download (4).png" alt="Transmission Installed" width={200} height={150} style={{ height: "auto" }} />
            </div>
            <h3>Transmission</h3>
            <p>Gearboxes, shafts, clutch plates, PTO units.</p>
          </div>

          {/* Brakes */}
          <div className="card">
            <div className="card-images">
              <Image src="/p/download (5).png" alt="Brake Part" width={200} height={150} style={{ height: "auto" }} />
              <Image src="/p/images (2).png" alt="Brake Assembly" width={200} height={150} style={{ height: "auto" }} />
            </div>
            <h3>Brake System</h3>
            <p>Brake pads, discs, valves, compressors, air dryers.</p>
          </div>

          {/* Suspension */}
          <div className="card">
            <div className="card-images">
              <Image src="/p/download (7).png" alt="Suspension Part" width={200} height={150} style={{ height: "auto" }} />
              <Image src="/p/download (6).png" alt="Suspension Installed" width={200} height={150} style={{ height: "auto" }} />
            </div>
            <h3>Suspension & Chassis</h3>
            <p>Leaf springs, shocks, torque rods, stabilizers.</p>
          </div>

          {/* Cabin */}
          <div className="card">
            <div className="card-images">
              <Image src="/p/download (8).png" alt="Cabin Part" width={200} height={150} style={{ height: "auto" }} />
              <Image src="/p/images (3).png" alt="Cabin Interior" width={200} height={150} style={{ height: "auto" }} />
            </div>
            <h3>Cabin & Accessories</h3>
            <p>Doors, dashboards, seats, mirrors, lighting assemblies.</p>
          </div>

          {/* Tires */}
          <div className="card">
            <div className="card-images">
              <Image src="/p/download (10).png" alt="Truck Tire" width={200} height={150} style={{ height: "auto" }} />
              <Image src="/p/download (9).png" alt="Tire Installed" width={200} height={150} style={{ height: "auto" }} />
            </div>
            <h3>Tires & Wheels</h3>
            <p>Heavy-duty truck tires (295/75R22.5, 1200R20), rims.</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="mv-container">
          <div className="mv-card mission">
            <h2>🌱 Our Mission</h2>
            <p>To empower fleets and dealers with genuine Sino Truck parts for reliable operations.</p>
          </div>
          <div className="mv-card vision">
            <h2>🌍 Our Vision</h2>
            <p>A future where every truck runs efficiently with genuine parts and trusted service.</p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="impact">
        <h2>📊 Our Impact</h2>
        <div className="stats">
          <div className="stat">
            <h3>10,000+</h3>
            <p>Trucks Serviced</p>
          </div>
          <div className="stat">
            <h3>500+</h3>
            <p>Fleet Clients</p>
          </div>
          <div className="stat">
            <h3>15+</h3>
            <p>Years Experience</p>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="partners">
        <h2>🤝 Our Partners</h2>
        <div className="partner-logos">
          <div className="partner">
            <Image src="/p/images (5).png" alt="Partner 1" width={200} height={100} />

          </div>
          <div className="partner">
            <Image src="/p/images (1).jpg" alt="Partner 2" width={200} height={100} />

          </div>
          <div className="partner">
            <Image src="/hero/images (4).png" alt="Partner 3" width={200} height={100} />

          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="contact">
        <h2>📞 Contact Us</h2>
        <p>📍 Plot 12, Main Street, Kampala, Uganda</p>
        <p>📞 +256 755 640710</p>
        <p>📧 info@katwalasolutions.com</p>
      </section>

      <footer>
        <p>© {new Date().getFullYear()} Katwala Solutions Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}
