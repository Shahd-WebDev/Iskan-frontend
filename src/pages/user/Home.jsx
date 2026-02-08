import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";

export default function Home() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Home Page</h1>
      <Button text="Explore Properties" />
      <h1 className="text-5xl font-bold text-blue-600">
  Tailwind Works 🎉
</h1>

    </Layout>
  );
}
