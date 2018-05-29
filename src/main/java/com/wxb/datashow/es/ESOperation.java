package com.wxb.datashow.es;

import java.util.Iterator;
import java.util.Map;

import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.search.aggregations.Aggregation;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.StringTerms;
import org.elasticsearch.search.aggregations.bucket.terms.StringTerms.Bucket;
/**
 * https://elasticsearch.cn/article/102
 * curl -XPUT '172.16.11.2:9200/tsgmj/_mapping/tsgmj?pretty' -H 'Content-Type: application/json' -d'
{
  "properties": {
    "cardid": { 
      "type":     "text",
      "fielddata": true
    }
  }
}
'
 * @author cwt
 *
 */
public class ESOperation {

	public static void main(String args[]) {
//		Client client = ESConnector.getConnection();
//		SearchResponse  response = client.prepareSearch("tsgmj")
//			        .setTypes("tsgmj")
//			        .setSearchType(SearchType.DEFAULT)
//			        //.setQuery(QueryBuilders.termQuery("visitno", "20640"))                 // Query
//			        //.setQuery(QueryBuilders.termQuery("dept", "法学院"))                // Query
//			        .setQuery(QueryBuilders.commonTermsQuery  ("dept", "法学院"))                // Query
//			        //.setPostFilter(QueryBuilders.rangeQuery("age").from(12).to(18))     // Filter
//			        .setFrom(0).setSize(5).setExplain(true)
//			        .get();
//		   System.out.println("response:"+response.toString());
		   
		    Client client = ESConnector.getConnection();
			SearchRequestBuilder srb = client.prepareSearch("tsgmj").setTypes("tsgmj");
			srb.addAggregation(AggregationBuilders.terms("cardid_count").field("cardid"));
  
			SearchResponse searchResponse = srb.get();
			Map<String, Aggregation> aggMap = searchResponse.getAggregations().asMap();
			System.out.println(aggMap);
			StringTerms teamAgg= (StringTerms) aggMap.get("cardid_count");
			Iterator<Bucket> teamBucketIt = teamAgg.getBuckets().iterator();
			while (teamBucketIt .hasNext()) {
			  Bucket buck = teamBucketIt .next();
			  //球队名
			  String team = (String) buck.getKey();
			  //记录数
			  long count = buck.getDocCount();
			  System.out.println("cardid:"+team);
			  System.out.println("count:"+count);
			}
	}
}
