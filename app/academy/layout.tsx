import { Header } from "@/components/header";

const AcademyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pt-16">
      {/* <AdvertBanner /> */}
      <Header maxwidth={true} />
      {children}
    </div>
  );
};

export default AcademyLayout;
