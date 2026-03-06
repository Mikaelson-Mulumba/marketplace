import NavBar from "../../components/NavBar";

export default function About() {
  return (
    <div>
      <NavBar />
      <section className="p-10 text-center">
        <h2 className="text-3xl font-bold text-limagreen">About Us</h2>
        <p className="mt-4 max-w-2xl mx-auto">
          LimaPro is dedicated to empowering Ugandan farmers through technology, market access, and community support. 
          Our mission is to create sustainable agricultural growth and prosperity.
        </p>
      </section>
    </div>
  );
}
