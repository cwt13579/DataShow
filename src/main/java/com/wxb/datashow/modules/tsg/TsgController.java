package com.wxb.datashow.modules.tsg;

import java.text.ParseException;
import java.util.Date;
import java.util.Map;

import org.apache.commons.lang3.time.DateUtils;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.CommonTermsQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.sort.SortOrder;

import com.mysql.jdbc.StringUtils;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.ResHits;
import com.wxb.datashow.es.ESConnector;

public class TsgController extends BaseController{

	public void getLibInOutListData() throws ParseException {
		Map<String, String> queryMap = getQueryMap();
		Client client = ESConnector.getConnection();
		SearchRequestBuilder srb = client.prepareSearch("tsgmj");
		srb.setTypes("tsgmj").setSearchType(SearchType.DEFAULT).setFrom(getPageCurrent()).setSize(10).setExplain(true);
//		if(!StringUtils.isNullOrEmpty(queryMap.get("user_name"))) {
//			srb.setQuery(QueryBuilders.commonTermsQuery("name",queryMap.get("user_name") ));                // Query
//		}
		BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
		if(!StringUtils.isNullOrEmpty(queryMap.get("user_name"))) {
		  CommonTermsQueryBuilder termsQuery = QueryBuilders.commonTermsQuery("cardid",queryMap.get("user_name"));
		  boolQuery.must(termsQuery);
         // srb.setQuery(termsQuery);                // Query
        }
		if(!StringUtils.isNullOrEmpty(queryMap.get("visit_time_gt"))) {
		  String  date1 = queryMap.get("visit_time_gt")+" 00:00:01 +0800";
		  String  date2 = queryMap.get("visit_time_gt")+" 23:59:59 +0800";

		  RangeQueryBuilder rangequerybuilder = QueryBuilders.rangeQuery("visittime").from(date1).to(date2);
		  //rangequerybuilder.lte(queryMap.get("visit_time_lt")+" 23:59:59 +0800");
		  boolQuery.must(rangequerybuilder);
		  //srb.setQuery(rangequerybuilder);                // Query
        }
		 
		srb.setQuery(boolQuery);
		srb.addSort("visitno", SortOrder.DESC);        
		SearchResponse searchResponse = srb.get();
		SearchHits hits = searchResponse.getHits();
		ResHits res=new ResHits(hits.getTotalHits(),hits);
		if(hits != null) {
			System.out.println(hits.getTotalHits());
		  renderJson(res);
		}
	}
}
