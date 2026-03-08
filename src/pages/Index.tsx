import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, hsl(220,20%,7%) 0%, hsl(220,25%,10%) 30%, hsl(170,50%,12%) 55%, hsl(200,60%,14%) 75%, hsl(214,50%,12%) 90%, hsl(220,20%,7%) 100%)",
      }}
    >
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
