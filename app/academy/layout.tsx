import AcademyFooter from "@/components/AcademyFooter";
import AcademyNavbar from "@/components/AcademyNavbar";
import { AdvertBanner } from "@/components/AdvertBanner";

const AcademyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {/* <AdvertBanner /> */}
      <AcademyNavbar />
      {children}
      <AcademyFooter />
    </div>
  );
};

export default AcademyLayout;
