package com.wxb.datashow.modules.tsg;

import java.util.Map;

import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHits;

import com.mysql.jdbc.StringUtils;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.ResHits;
import com.wxb.datashow.es.ESConnector;

public class TsgController extends BaseController{

	public void getLibInOutListData() {
		Map<String, String> queryMap = getQueryMap();
		Client client = ESConnector.getConnection();
		SearchRequestBuilder srb = client.prepareSearch("tsgmj");
		srb.setTypes("tsgmj").setSearchType(SearchType.DEFAULT).setFrom(getPageCurrent()).setSize(10).setExplain(true);
		if(!StringUtils.isNullOrEmpty(queryMap.get("user_name"))) {
			srb.setQuery(QueryBuilders.commonTermsQuery("name",queryMap.get("user_name") ));                // Query
		}
		           
		SearchResponse searchResponse = srb.get();
		SearchHits hits = searchResponse.getHits();
		ResHits res=new ResHits(hits.getTotalHits(),hits);
		if(hits != null) {
			System.out.println(hits.getTotalHits());
		  renderJson(res);
		}
	}
}
