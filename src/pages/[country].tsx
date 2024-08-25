import { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { MouseEventHandler, useEffect, useState } from "react";
import { MdOutlineWest } from "react-icons/md";

function Country({
  countryData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const formatNumber = Intl.NumberFormat();
  const [borders, setBorders] = useState<string[]>([]);
  const object: any = Object;
  const domain = countryData.tld[0];

  useEffect(() => {
    setBorders([]);
    countryData.borders.map(async (border) => {
      const res = await fetch(
        `https://restcountries.com/v3.1/alpha/${border}?fields=name`
      );
      const {
        name: { common },
      } = await res.json();
      return setBorders((borders) => [...borders, common]);
    });
  }, [countryData]);

  function getNativeName() {
    const firstNativeName = object.values(countryData.name.nativeName)[0]
      ? object.values(countryData.name.nativeName)[0].common
      : "No native name";
    return firstNativeName;
  }

  function getCurrency() {
    const currency = object.values(countryData.currencies)[0]
      ? object.values(countryData.currencies)[0].name
      : "No currency";

    return currency;
  }

  function getLanguages() {
    const languages = object.values(countryData.languages);
    const languagesJsx = languages.map(
      (language: JSX.Element, index: number) => (
        <p key={index} className="mr-1">
          {language}
          {languages.length > 1 ? "," : ""}
        </p>
      )
    );
    return languagesJsx;
  }

  function getPopulation() {
    const formattedPopulation = formatNumber.format(
      parseInt(countryData.population)
    );
    const stringifiedPopulation = formattedPopulation.toString();
    return stringifiedPopulation;
  }

  function Button({
    className,
    children,
    onClick,
  }: {
    className?: string;
    children: any;
    onClick?: MouseEventHandler<HTMLButtonElement>;
  }) {
    return (
      <button
        onClick={onClick}
        className={`${className} light-element dark:dark-element  rounded-sm px-6  py-1 
          shadow-md outline-none active:scale-90 `}
      >
        {children}
      </button>
    );
  }

  function Statistic(props: { title: string; children: string | undefined }) {
    return (
      <div className="mb-4  flex items-center gap-2">
        <p className="font-semibold">{props.title}: </p>
        <div className="flex items-center ">{props.children}</div>
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

      <div className=" relative flex flex-1  grid-cols-2 flex-col items-center p-8 px-10 lg:mt-10 lg:flex-row lg:gap-20  xl:gap-40 xl:px-20">
        <div className="relative flex   w-full flex-col lg:w-2/5">
          <Button
            onClick={() => router.back()}
            className=" mb-10  flex max-w-[120px] items-center gap-1 py-1 md:px-8 md:py-3"
          >
            <MdOutlineWest />
            Back
          </Button>

          <div className="relative  w-full     py-10">
            <img
              src={countryData.flags.png}
              alt={countryData.flags.alt}
              className="max-h-[400px] w-full max-w-[700px] bg-cover  "
            />
          </div>
        </div>

        {countryData.name.common === "Azerbaijan" ? (
          <p className="absolute left-1/2 top-0 -translate-x-1/2 text-xl font-semibold ">
            You're now on the page of my country :b
          </p>
        ) : null}

        <div className="   w-full lg:w-3/5 xl:w-2/5">
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

          <div className="   mt-10   flex items-center gap-3 lg:max-w-2xl">
            Bordering Countries:{" "}
            {borders.length === 0 ? (
              <p className=" italic text-gray-500">
                No bordering countries, probably an island lol
              </p>
            ) : (
              <div className="flex  flex-wrap items-center gap-2">
                {borders.map((border, index) => {
                  return (
                    <Button key={index} onClick={() => router.push(border)}>
                      {" "}
                      {border}
                    </Button>
                  );
                })}
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
    languages: {};
    subregion: string;
    borders: [];
    name: {
      nativeName: {};
      common: string;
      official: string;
    };
    tld: string[];
    currencies: {};
    flags: { png: string; alt: string };
    region: string;
    capital: string;
    population: string;
  };
}> = async function (context) {
  const res = await fetch(
    `https://restcountries.com/v3.1/name/${context.params?.country}?fields=name,cioc,capital,borders,region,subregion,tld,currency,flags,currencies,population,languages`
  );
  const data = await res.json();

  if (!data) {
    return { notFound: true };
  }

  const countryData = data[0];
  return { props: { countryData } };
};
