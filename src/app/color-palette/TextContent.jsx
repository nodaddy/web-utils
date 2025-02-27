import React from "react";

const ColorPaletteSEOContent = () => {
  return (
    <>
      <h1 align="right" className="text-3xl mb-5 pl-6 pr-2">
        Color Palette
        <br /> <sup>Your Color Harmony Tool</sup>
      </h1>
      <div className="mx-auto max-w-4xl px-6 bg-gray-50 text-gray-600 py-8 rounded-r-xl">
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Harmony: Transform Your Designs with Perfect Color Combinations
          </h2>
          <p className="mb-4">
            Discover the power of color harmony. Just pick a colour from the
            colour picker and click on "Generate Harmony" to get a palette of 5
            colours. Whether you're looking for pastel color palettes, bright
            color palettes, or specific hues like purple, pink, and orange, our
            tool helps you with some pre-built palette collections too.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            Popular Color Collections
          </h2>
          <ul className="space-y-4">
            <li>
              <h3 className="text-xl font-medium">Pastel Color Palettes</h3>
              <p>
                Soft, soothing combinations perfect for nurseries, wedding
                designs, and spring themes.
              </p>
            </li>
            <li>
              <h3 className="text-xl font-medium">Bright Color Palettes</h3>
              <p>
                Vibrant, attention-grabbing schemes ideal for advertising,
                children's content, and festive designs.
              </p>
            </li>
            <li>
              <h3 className="text-xl font-medium">Purple Color Palettes</h3>
              <p>
                From lavender to deep violet, explore the royal spectrum for
                luxury branding and creative projects.
              </p>
            </li>
            <li>
              <h3 className="text-xl font-medium">Pink Color Palettes</h3>
              <p>
                Discover shades from blush to fuchsia for feminine designs or
                bold visual statements.
              </p>
            </li>
            <li>
              <h3 className="text-xl font-medium">Orange Color Palettes</h3>
              <p>
                Warm, energetic combinations from peach to burnt orange for food
                brands and autumn themes.
              </p>
            </li>
          </ul>
        </section>

        <section className="mb-10" id="faqs">
          <h2 className="text-2xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium">What is a color palette?</h3>
              <p>
                A color pallate is a collection of colors that work well
                together. Our color palette creator helps you generate
                harmonious color schemes for any design project, from websites
                to branding to interior design.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium">
                How do I create a pastel color palette?
              </h3>
              <p>
                Pastel colors are created by adding white to pure hues. In our
                app, you can easily generate pastel color palettes by selecting
                the "Pastel" filter and adjusting the saturation and brightness
                levels. You can also browse our curated collection of pastel
                palettes.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium">
                What's the difference between RGB and HEX color codes?
              </h3>
              <p>
                RGB (Red, Green, Blue) uses three numbers to define colors,
                while HEX codes use a 6-digit combination of numbers and
                letters. Our app provides both formats for all colors in your
                palette, making it easy to use them in any design software.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium">
                How many colors should be in a color palette?
              </h3>
              <p>
                Most professional color palettes contain 3-5 colors, including
                primary, secondary, and accent colors. Our app allows you to
                create palettes with up to 10 colors, but we recommend focusing
                on 3-5 core colors for most projects.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium">
                How do I create a monochromatic purple color palette?
              </h3>
              <p>
                Use our monochromatic tool to select any purple shade as your
                base color. The app will automatically generate lighter and
                darker variations while maintaining the same hue, creating a
                cohesive purple color palette.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium">
                What makes a good bright color palette?
              </h3>
              <p>
                Bright color palettes typically feature high saturation colors
                with strong contrast. The key is balancing these vibrant hues
                with neutral tones to prevent visual overwhelm. Our app suggests
                complementary neutrals for every bright palette you create.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            Why Choose Our Color Palette Creator
          </h2>
          <ul className="space-y-2">
            <li>• Professional-grade tools accessible to beginners</li>
            <li>• Thousands of pre-made color schemes in all categories</li>
            <li>• Export options compatible with all major design software</li>
            <li>• Regular updates with trending color combinations</li>
            <li>• Save unlimited palettes to your personal collection</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            Color Palette Resources
          </h2>
          <p className="mb-4">
            Explore our extensive collection of articles on color theory,
            palette creation guides, and industry-specific color
            recommendations. Learn how to use color psychology to enhance your
            designs and create memorable visual experiences.
          </p>
        </section>

        <footer className="text-sm text-gray-600 mt-16">
          <p>
            Keywords: color palette, colour circle, color chart, pastel color
            palette, bright color palette, purple color palette, pink color
            palette, orange color palette
          </p>
        </footer>
      </div>
    </>
  );
};

export default ColorPaletteSEOContent;
