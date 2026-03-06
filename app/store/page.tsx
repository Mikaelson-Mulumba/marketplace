import NavBar from "../../components/NavBar";

export default function Store() {
  return (
    <div>
      <NavBar />
      <section className="p-10 text-center">
        <h2 className="text-3xl font-bold text-limagreen">Our Stores</h2>
        <p className="mt-4 max-w-2xl mx-auto">
          LimaPro provides farmers with access to essential products through both physical outlets and online stores. 
          We ensure quality, affordability, and convenience for every farmer.
        </p>
      </section>
    </div>
  );
}
