import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
// import "/assets/css/main.css";
// assuming you migrate CSS to modules

export default function HomePage() {
  return (
    <>
      <Head>
        <title>NFT Minter</title>
        <meta charSet="utf-8" />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="stylesheet" href="/assets/css/main.css" /> */}
      </Head>

      <header id="header" className="alt">
        <div className="logo">
          <Link href="/">
            NFT Minter <span>by TRAVIS</span>
          </Link>
        </div>
        <a href="#menu">Menu</a>
      </header>

      <nav id="menu">
        <ul className="links">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/generic">Generic</Link>
          </li>
          <li>
            <Link href="/elements">Elements</Link>
          </li>
        </ul>
      </nav>

      <section className="banner full">
        <article
          className="hero-article"
          // style={{
          //   backgroundImage: 'url("/images/slide01.jpg")',
          //   backgroundSize: "cover",
          //   backgroundRepeat: "no-repeat",
          //   backgroundPosition: "center center",
          //   height: "75vh",
          // }}
        >
          <Image
            src="/images/slide01.jpg"
            alt=""
            width={1440}
            height={961}
            // style={{ display: "none" }}
          />
          <div className="inner">
            <header>
              <p>Unleash and protect your creativity by using</p>
              <h2>NFT Minter</h2>
            </header>
          </div>
        </article>
      </section>

      <section id="one" className="wrapper style2">
        <div className="inner">
          <div className="grid-style">
            {[2, 3].map((i) => (
              <div key={i}>
                <div className="box">
                  <div className="image fit">
                    <Image
                      src={`/images/pic0${i}.jpg`}
                      alt=""
                      width={600}
                      height={300}
                    />
                  </div>
                  <div className="content">
                    <header className="align-center">
                      <p>
                        {i === 2
                          ? "maecenas sapien feugiat ex purus"
                          : "mattis elementum sapien pretium tellus"}
                      </p>
                      <h2>
                        {i === 2 ? "Lorem ipsum dolor" : "Vestibulum sit amet"}
                      </h2>
                    </header>
                    <p>
                      Cras aliquet urna ut sapien tincidunt, quis malesuada elit
                      facilisis. Vestibulum sit amet tortor velit. Nam elementum
                      nibh a libero pharetra elementum. Maecenas feugiat ex
                      purus, quis volutpat lacus placerat malesuada.
                    </p>
                    <footer className="align-center">
                      <input
                        type="file"
                        className="button-alt"
                        placeholder="Enter your name"
                        style={{ width: 211 }}
                      />
                    </footer>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="two" className="wrapper style3">
        <div className="inner">
          <header className="align-center">
            <p>
              Nam vel ante sit amet libero scelerisque facilisis eleifend vitae
              urna
            </p>
            <h2>Morbi maximus justo</h2>
          </header>
        </div>
      </section>

      <section id="three" className="wrapper style2">
        <div className="inner">
          <header className="align-center">
            <p className="special">
              Nam vel ante sit amet libero scelerisque facilisis eleifend vitae
              urna
            </p>
            <h2>Morbi maximus justo</h2>
          </header>
          <div className="gallery">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="image fit">
                  <a href="#">
                    <Image
                      src={`/images/pic0${i}.jpg`}
                      alt=""
                      width={600}
                      height={300}
                    />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="footer">
        <div className="container">
          <ul className="icons">
            {["twitter", "facebook", "instagram", "envelope-o"].map((icon) => (
              <li key={icon}>
                <a href="#" className={`icon fa-${icon}`}>
                  <span className="label">{icon}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>

      <div className="copyright">
        Made with <a href="https://templated.co/">Templated</a> Distributed by
        <a href="https://themewagon.com/">ThemeWagon</a>.
      </div>

      <Script src="/assets/js/jquery.min.js" strategy="beforeInteractive" />
      <Script
        src="/assets/js/jquery.scrollex.min.js"
        strategy="beforeInteractive"
      />
      <Script src="/assets/js/skel.min.js" strategy="beforeInteractive" />
      <Script src="/assets/js/util.js" strategy="beforeInteractive" />
      <Script src="/assets/js/main.js" strategy="afterInteractive" />
    </>
  );
}
