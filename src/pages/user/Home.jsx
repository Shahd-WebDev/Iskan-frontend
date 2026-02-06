import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";

export default function Home() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Home Page</h1>
      <Button text="Explore Properties" />
    </Layout>
  );
}
