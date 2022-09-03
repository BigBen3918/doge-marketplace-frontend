import React, { useCallback, useState } from 'react';
import Select from "react-select";

import NFTLists from '../components/NFTLists';
import Footer from '../menu/footer';
import { useBlockchainContext } from '../../context';

const customStyles = {
  option: (base, state) => ({
    ...base,
    background: "#0f0f0f",
    color: "#fff",
    borderRadius: state.isFocused ? "0" : 0,
    "&:hover": {
      background: "#0f0f0f",
    },
  }),
  menu: (base) => ({
    ...base,
    background: "#0f0f0f !important",
    borderRadius: 0,
    marginTop: 0,
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  control: (base, state) => ({
    ...base,
    padding: 2,
  }),
};

const options = [
  { value: "All categories", label: "All categories" },
  { value: "Art", label: "Art" },
  { value: "Music", label: "Music" },
  { value: "Domain Names", label: "Domain Names" },
];
const options1 = [
  { value: "All", label: "All" },
  { value: "OnSaled", label: "On saled" },
  { value: "Owned", label: "Owned" },
];
const options2 = [
  { value: "Rating", label: "Rating" },
  { value: "PriceLTH", label: "Price (Low to High)" },
  { value: "PriceHTL", label: "Price (High to Low)" },
  { value: "NameASC", label: "Name (ASC)" },
  { value: "NameDESC", label: "Name (DESC)" },
];

export default function Explore() {
  const [state, { translateLang }] = useBlockchainContext();
  const [searchWord, setSearchWord] = useState('');

  const [selectedOption1, setSelectedOption1] = useState(options1[0]);
  const [selectedOption2, setSelectedOption2] = useState(options2[0]);
  const [selectedOption3, setSelectedOption3] = useState(null);

  // status filter
  const filter1 = useCallback((item) => {
    switch (selectedOption1.value) {
      case "OnSaled":
        return item?.owner?.toUpperCase() === state.addresses?.Marketplace?.toUpperCase();
      case "Owned":
        return item?.owner?.toUpperCase() !== state.addresses?.Marketplace?.toUpperCase();
      default:
        return true;
    }
  }, [selectedOption1]);

  const filter2 = useCallback((item) => { return true }, []);

  //search filter
  const filter3 = useCallback((item) => {
    const searchParams = ["owner", "name", "description", "collectionAddress"];
    return searchParams.some((newItem) => {
      return (item[newItem]?.toString().toLowerCase().indexOf(searchWord.toLowerCase()) > -1) || (item["metadata"][newItem]?.toString().toLowerCase().indexOf(searchWord.toLowerCase()) > -1);
    })
  }, [searchWord]);

  // sort option
  const sortBy = useCallback((a, b) => {
    let res = true;
    switch (selectedOption2.value) {
      case "Rating":
        res = Number(a.likes?.length) < Number(b.likes?.length);
        break;
      case "PriceLTH":
        if (a.marketdata?.price == null || Number(b.marketdata?.price) == 0) return -1;
        res = Number(a.marketdata?.price) > Number(b.marketdata?.price);
        break;
      case "PriceHTL":
        if (a.marketdata?.price == null || Number(b.marketdata?.price) == 0) return -1;
        res = Number(b.marketdata?.price) > Number(a.marketdata?.price);
        break;
      case "NameASC":
        res = a.metadata?.name > b.metadata?.name;
        break;
      case "NameDESC":
        res = b.metadata?.name > a.metadata?.name;
        break;
      default:
        res = true;
    }
    return res ? 1 : -1;
  }, [selectedOption2])

  return (
    <div>
      <section className="jumbotron breadcumb no-bg">
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12">
                <h1 className="text-center">{translateLang('allnft_title')}</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="items_filter">
              <form
                className="row form-dark"
                id="form_quick_search"
                name="form_quick_search"
              >
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    id="name_1"
                    name="name_1"
                    placeholder={translateLang('seachtext')}
                    onChange={(e) => setSearchWord(e.target.value)}
                    value={searchWord}
                  />
                  <div className="clearfix"></div>
                </div>
              </form>
              <div className="dropdownSelect two">
                <Select
                  className="select1"
                  styles={customStyles}
                  defaultValue={options1[0]}
                  options={options1}
                  onChange={setSelectedOption1}
                />
              </div>
              <div style={{ display: "inline-block" }}> Sort by </div>
              <div className="dropdownSelect three">
                <Select
                  className="select1"
                  styles={customStyles}
                  defaultValue={options2[0]}
                  options={options2}
                  onChange={setSelectedOption2}
                />
              </div>
            </div>
          </div>
        </div>
        <NFTLists filter1={filter1} filter2={filter2} filter3={filter3} sortBy={sortBy} />
      </section>

      <Footer />
    </div>
  );
}
