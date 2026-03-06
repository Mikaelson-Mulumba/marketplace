import NavBar from "../../components/NavBar";

export default function Market() {
  return (
    <div>
      <NavBar />
      <section className="p-10 text-center">
        <h2 className="text-3xl font-bold text-limagreen">Market Access</h2>
        <p className="mt-4 max-w-2xl mx-auto">
          LimaPro connects farmers directly to buyers, ensuring fair trade and sustainable income. 
          Our platform bridges the gap between production and demand.
        </p>
      </section>
    </div>
  );
}
