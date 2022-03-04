export const FeatureCard = ({ title, text }) => {
    return (
        <>
            <div className="flex py-5 my-4  lg:m-0 max-w-[338px] m-auto">
                <div className="">
                    logo
                </div>
                <div className="ml-[5px]  ">
                    <p className="font-bold">{title}</p>
                    <p className="text-left">{text}</p>
                </div>
            </div>
        </>
    )
}