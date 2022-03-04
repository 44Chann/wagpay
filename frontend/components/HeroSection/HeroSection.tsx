import { Features } from "./features"
import { HeroText } from "./HeroText"

export const HeroSection = () => {
    return (
        <>
            <div className=" py-[150px] w-[90%] m-auto lg:w-[90%]">
                <HeroText />
                <Features />
            </div>
        </>
    )
}