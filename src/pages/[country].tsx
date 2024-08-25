import { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { MouseEventHandler, useEffect, useState } from "react";
import { MdOutlineWest } from "react-icons/md";

function Country({
  countryData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const formatNumber = Intl.NumberFormat();
  const [borders, setBorders] = useState<string[]>([]);
  const domain = countryData.tld[0];

  useEffect(() => {
    setBorders([]);
    const fetchBorders = async () => {
      for (const border of countryData.borders) {
        try {
          const res = await fetch(
            `https://restcountries.com/v3.1/alpha/${border}?fields=name`
          );
          const {
            name: { common },
          } = await res.json();
          setBorders((prevBorders) => [...prevBorders, common]);
        } catch (error) {
          console.error(`Failed to fetch border country: ${border}`, error);
        }
      }
    };
    fetchBorders();
  }, [countryData.borders]);

  function getNativeName() {
    const nativeNames = Object.values(countryData.name.nativeName);
    return nativeNames.length > 0 ? nativeNames[0].common : "No native name";
  }

  function getCurrency() {
    const currencies = Object.values(countryData.currencies);
    return currencies.length > 0 ? currencies[0].name : "No currency";
  }

  function getLanguages() {
    const languages = Object.values(countryData.languages);
    return languages.map((language, index) => (
      <p key={index} className="mr-1">
        {index < languages.length - 1 ? "," : ""}
      </p>
    ));
  }

  function getPopulation() {
    const formattedPopulation = formatNumber.format(
      parseInt(countryData.population, 10)
    );
    return formattedPopulation.toString();
  }

  function Button({
    className,
    children,
    onClick,
  }: {
    className?: string;
    children: React.ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
  }) {
    return (
      <button
        onClick={onClick}
        className={`${className} light-element dark:dark-element rounded-sm px-6 py-1 shadow-md outline-none active:scale-90`}
      >
        {children}
      </button>
    );
  }

  function Statistic(props: { title: string; children: React.ReactNode }) {
    return (
      <div className="mb-4 flex items-center gap-2">
        <p className="font-semibold">{props.title}: </p>
        <div className="flex items-center">{props.children}</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{countryData.name.common}</title>
        <meta
          name="description"
          content={`A handful of information about the country ${countryData.name.common}.`}
        />
      </Head>

      <div className="relative flex flex-1 grid-cols-2 flex-col items-center p-8 px-10 lg:mt-10 lg:flex-row lg:gap-20 xl:gap-40 xl:px-20">
        <div className="relative flex w-full flex-col lg:w-2/5">
          <Button
            onClick={() => router.back()}
            className="mb-10 flex max-w-[120px] items-center gap-1 py-1 md:px-8 md:py-3"
          >
            <MdOutlineWest />
            Back
          </Button>

          <div className="relative w-full py-10">
            <Image
              src={countryData.flags.png}
              alt={countryData.flags.alt || "Country flag"}
              layout="responsive"
              width={700}
              height={400}
              className="max-h-[400px] w-full max-w-[700px] bg-cover"
            />
          </div>
        </div>

        {countryData.name.common === "Azerbaijan" && (
          <p className="absolute left-1/2 top-0 -translate-x-1/2 text-xl font-semibold">
            You&apos;re now on the page of my country :b
          </p>
        )}

        <div className="w-full lg:w-3/5 xl:w-2/5">
          <p className="pb-6 text-4xl font-semibold md:mb-4 lg:mt-20">
            {countryData.name.common}
          </p>

          <div className="flex flex-col justify-between sm:flex-row">
            <div>
              <Statistic title="Native Name">
                {countryData.name.nativeName === undefined
                  ? "No native name.."
                  : getNativeName()}
              </Statistic>

              <Statistic title="Capital">
                {countryData.capital.length === 0
                  ? "No capital"
                  : countryData.capital}
              </Statistic>

              <Statistic title="Population">{getPopulation()}</Statistic>
              <Statistic title="Region">{countryData.region}</Statistic>
              <Statistic title="Sub Region">{countryData.subregion}</Statistic>
            </div>

            <div className="my-10 md:my-0">
              <Statistic title="Currency">{getCurrency()}</Statistic>
              <Statistic title="Domain">{domain}</Statistic>
              <Statistic title="Languages">{getLanguages()}</Statistic>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-3 lg:max-w-2xl">
            Bordering Countries:{" "}
            {borders.length === 0 ? (
              <p className="italic text-gray-500">
                No bordering countries, probably an island lol
              </p>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                {borders.map((border, index) => (
                  <Button
                    key={index}
                    onClick={() => router.push(`/countries/${border}`)}
                  >
                    {border}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Country;

export async function getStaticPaths() {
  const res = await fetch("https://restcountries.com/v3.1/all?fields=name");
  const countryData = await res.json();

  const paths = countryData.map((country: { name: { common: string } }) => ({
    params: { country: country.name.common },
  }));

  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps<{
  countryData: {
    languages: Record<string, { common: string }>;
    subregion: string;
    borders: string[];
    name: {
      nativeName: Record<string, { common: string }>;
      common: string;
      official: string;
    };
    tld: string[];
    currencies: Record<string, { name: string }>;
    flags: { png: string; alt: string };
    region: string;
    capital: string;
    population: string;
  };
}> = async function (context) {
  const res = await fetch(
    `https://restcountries.com/v3.1/name/${context.params?.country}?fields=name,cioc,capital,borders,region,subregion,tld,currencies,flags,population,languages`
  );
  const data = await res.json();

  if (!data || data.length === 0) {
    return { notFound: true };
  }

  const countryData = data[0];
  return { props: { countryData } };
};
