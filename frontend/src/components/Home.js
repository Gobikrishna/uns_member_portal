import agriculture from "../assets/images/agriculture.png";
import education from "../assets/images/education.png";
import energy from "../assets/images/renewabkeenergy.png";
import healthcare from "../assets/images/healthcare.png";
import ecommerce from "../assets/images/ecommerce.png";
import realestate from "../assets/images/realestate.png";
import hybridcex from "../assets/images/hybridcex.png";
import dex from "../assets/images/dex.png";
import blockchain from "../assets/images/ownblockchain.png";
import gamism from "../assets/images/gamism.png";
import sport from "../assets/images/sports.png";
import hosp from "../assets/images/hospitality.png";
import Header from "./Header";
import Footer from "./Footer";

const Home = () => {
  const featureImages = [
    { img: agriculture},
    { img: education},
    { img: gamism},
    { img: energy},
    { img: hosp},
    { img: healthcare},
    { img: sport},
    { img: hybridcex},
    { img: realestate},
    { img: blockchain},
    { img: ecommerce},
    { img: dex},
  ];

  return (
    <div>
      {/* Navigation Bar */}
      <Header />

      {/* Hero Section */}
      <div className="home-cont pb-4">
        {/* <section className="text-white text-center">
          <div className="container px-4 pt-4">
            <img width="100%" src={unsHero} alt="Hero" />
          </div>
        </section> */}

        {/* Features Section */}
        <section className="container text-center">
          <h2 className="text-white p-5">Explore Your Investment Opportunities</h2>
          <div className="grid align-items-center flex-wrap gap-4 select-coloumn uns-items mb-4">
            {featureImages.map((feature, index) => (
              <div key={index} className="">
                <img src={feature.img} alt={feature.title} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
     <Footer />
    </div>
  );
}

export default Home;
