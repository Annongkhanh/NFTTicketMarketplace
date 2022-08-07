import { Select } from "antd";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getCollectionsByChain } from "helpers/collections";

function SearchEvent({ setInputValue }) {
  const { Option } = Select;
  const { chainId } = useMoralisDapp();
  const NFTCollections = getCollectionsByChain(chainId);

  function onChange(value) {
    setInputValue(value);
  }

  return (
    <>
      <Select
        showSearch
        style={{ width: "50%", marginLeft: "1%" }}
        placeholder="Find Event"
        optionFilterProp="children"
        onChange={onChange}
      >
        {NFTCollections &&
          NFTCollections.map((collection, i) => (
            <Option value={collection.addrs} key={i}>
              {collection.name}
            </Option>
          ))}
      </Select>
    </>
  );
}
export default SearchEvent;
