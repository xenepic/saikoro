const { Util } = require('./Util');
const axios = require("axios").default;

class GeoCoding {

    /**
     * 土地名・建物名などから緯度経度情報を取得する
     * @param {string} keyword 検索キーワード
     * @returns {Object} 
     */
    static async getGeoCode(keyword){
        try{
            // 国土交通省-国土地理院のジオコーディングAPIを使用する
            let url = "https://msearch.gsi.go.jp/address-search/AddressSearch";

            let response = await axios.get(url, {
                params: {
                    q: keyword
                }
            });

            if(response.status !== 200){
                Util.error(response);
                return;
            }

            // 検索結果なしの場合は終了
            if(response.data.length <= 0) return;

            // 一件ヒットの場合はそのジオコードを返す
            else if(response.data.length === 1) return response.data[0];
            
            // 複数件ヒットした場合
            else {
                let geocode;
                for(let i=1;i<6;i++){
                    geocode = response.data
                                .filter(e=>parseInt(e.properties.dataSource)===i&&e.properties.title.includes(keyword))
                                .sort((a,b)=>a.properties.title.length - b.properties.title.length)[0];
                    if(geocode) break;
                }

                return geocode;
            }

        }catch(e){
            Util.error(e);
            return;
        }
    }
}

module.exports = { GeoCoding };