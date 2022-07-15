import React, {useState, useRef, useEffect} from "react";

const LightBox = ({children, src, alt, Wrapper = 'div'}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scaleImg, setScaleImg] = useState(1);

    //refs
    const screenshotImg = useRef(null);

    const toggleIsOpen = () => {
        setScaleImg(1);
		setIsOpen(!isOpen);
	};

    const increase = (e) => {
        e.preventDefault();
        screenshotImg.current.style.transformOrigin = 'top';
        screenshotImg.current.style.transform = `scale(${setScaleImg(scaleImg + 0.5)})`;
    }

    const decrease = (e) => {
        e.preventDefault();
        screenshotImg.current.style.transformOrigin = 'top';
        if(scaleImg >= 1) {
          screenshotImg.current.style.transform = `scale(${setScaleImg(scaleImg - 0.5)})`;
        }
    }

    return (
        <>
        {isOpen ?
        <>
            {/* {document.body.classList.add('body-overflow')} */}

            <div className="lightbox-controls"> 
                <a id="img-increase" href="null" onClick={e => increase(e)}><img alt='icon' src={require('../img/increase.png')} /></a>
                <a id="img-decrease" href="null" onClick={e => decrease(e)}><img alt='icon' src={require('../img/decrease.png')} /></a>
            </div>
        </>
       : null}

        <Wrapper onClick={toggleIsOpen}>
            {children}
            {isOpen ?
				<div className="lightbox-container" onClick={toggleIsOpen}>
					<img ref={screenshotImg} style={{transform: `scale(${scaleImg})`}} className="lightbox-img" src={src} alt={alt} />
				</div>
			: null}
        </Wrapper>
        </>
    )
}

export default LightBox;