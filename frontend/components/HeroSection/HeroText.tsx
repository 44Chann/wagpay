export const HeroText = () => {
    return (
        <>
            <div className="m-auto mb-[60px] w-[90%] max-w-[700px]  lg:mx-0 lg:w-full">
                <div className=" lg:w-[75ch] w-[35ch]  text-center m-auto" >
                    <p className="lg:text-[4.2rem] lg:leading-none lg:text-left leading-tight font-inter text-[2rem] font-black">Next genration payment gateway for  the internet </p>
                </div>
                <div className="m-auto my-4 text-center text-[0.9rem] lg:my-[50px]">
                    <p className="lg:text-left lg:text-[1.2rem]">Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs to accept payments, send payouts, and manage their businesses online.</p>
                </div>
                <div className="w-[95%] lg:m-0 lg:justify-start flex  m-auto justify-center">
                    <button className="bg-[#6C7EE1] py-3 px-8 text-center text-white rounded ">Try now</button>
                    <button className="ml-5 hover:border-b-[1px] border-black">How it works <span>{">"}</span></button>
                </div>
            </div>
        </>
    )
}