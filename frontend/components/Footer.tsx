interface Props {}

const Footer = (props: Props) => {
  return (
    <div className="font-poppins w-full h-fit bg-[#6C7EE1]/20 px-16 py-20 pb-36 font-inter">
      <div className="flex lg:flex-row flex-col justify-around border-t-2 border-gray-700 pt-20">
        {/* left side */}
        <div className="flex flex-col w-full">
          <h1 className="text-2xl text-center lg:text-left font-extrabold">
            WagPay
          </h1>
          <p className="w-full lg:w-7/12 text-center lg:text-left">
		  	Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs to accept payments, send payouts, and manage their businesses online.
          </p>
        </div>
        {/* right side  */}
        <div className="w-full flex justify-center mt-10 lg:mt-0">
          <ul className="space-y-2 mr-28">
            <li>About Us</li>
            <li>Contact us</li>
          </ul>
          <ul className="space-y-2">
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
