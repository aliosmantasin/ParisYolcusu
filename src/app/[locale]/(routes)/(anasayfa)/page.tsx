import BottomNavigation from "../_components/homepage/BottomNavigation";
import CallToActionComponent from "../_components/homepage/CallToActionComponent";
import FeaturesBrand from "../_components/homepage/FeaturesBrand";
import FirstGlance from "../_components/homepage/FirstGlance";
import Services from "../_components/homepage/Services";
import Testimonials from "../_components/homepage/Testimonials";
import { QuestionsSSS } from "../_components/homepage/QuestionsSSS";
import AboutComponent from "../_components/homepage/AboutComponent";
import CleanCar from "../_components/homepage/CleanCar";


export default function Home() {

  return (
    <>
      <FirstGlance/>
      <Services/>
      <FeaturesBrand/>
      {/* <Referance/> */}
      <Testimonials/>
      <AboutComponent/>
      <CallToActionComponent/>
      <QuestionsSSS/>
      <BottomNavigation/>
      <CleanCar/>
    </>
  );
}
