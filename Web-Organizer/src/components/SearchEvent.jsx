import { Input } from 'antd';



function SearchEvent({setInputValue}){


    const { Search } = Input;
    function onChange(e) {
        setInputValue(e);
    }

    return (
        <>
        <Search
            
            style={{width: "50%",
                    marginLeft: "1%" }}
            placeholder="Find Event"
            
            onSearch={onChange}
        >   
    
        </Search>
            
        </>
    )
}
export default SearchEvent;