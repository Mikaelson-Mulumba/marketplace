import NavBar from "../../components/NavBar";

export default function LoanScheme() {
  return (
    <div>
      <NavBar />
      <section className="p-10 text-center">
        <h2 className="text-3xl font-bold text-limagreen">Loan Scheme</h2>
        <p className="mt-4 max-w-2xl mx-auto">
          Our Buy Now, Pay Later program helps farmers access products immediately and pay flexibly over time, 
          reducing financial barriers to growth.
        </p>
      </section>
    </div>
  );
}
