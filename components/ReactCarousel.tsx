import 'keen-slider/keen-slider.min.css'

import { useKeenSlider } from 'keen-slider/react'

import React, { ReactElement } from 'react'

interface CarouselProps {
    children?: ReactElement[];
    className?: string;

    mode?: 'snap' | 'free-snap' | 'free';
    loop?: boolean;
    vertical?: boolean;
    centered?: boolean;
    spacing?: number;
    slidesPerView?: number;
}

const ReactCarousel: React.FC<CarouselProps> = (props) => {
    const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
        mode: typeof props.mode !== 'undefined' ? props.mode : "free-snap",
        centered: typeof props.centered !== 'undefined' ? props.centered : true,
        loop: typeof props.loop !== 'undefined' ? props.loop : false,
        spacing: typeof props.spacing !== 'undefined' ? props.spacing : 0,
        vertical: typeof props.vertical !== 'undefined' ? props.vertical : false,
        slidesPerView: typeof props.slidesPerView !== 'undefined' ? props.slidesPerView : 2,
    });


    const children = () => {
        const mapper: ReactElement[] = React.Children.map(props.children, child => {
                return React.cloneElement(child, {
                    ...child.props,
                    className: `${child.props.className} keen-slider__slide`
                })
            }
        );

        return mapper;
    }
    

    return (
        <div ref={sliderRef} className={`${props.className + " " || ""}keen-slider`}>
            {children()}
        </div>
    ) 
}

export default ReactCarousel;