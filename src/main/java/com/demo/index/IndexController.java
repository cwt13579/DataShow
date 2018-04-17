package com.demo.index;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.search.aggregations.Aggregation;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.StringTerms;
import org.elasticsearch.search.aggregations.bucket.terms.StringTerms.Bucket;

import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.es.ESConnector;

/**
 * 本 demo 仅表达最为粗浅的 jfinal 用法，更为有价值的实用的企业级用法
 * 详见 JFinal 俱乐部: http://jfinal.com/club
 * 
 * IndexController
 */
public class IndexController extends BaseController {
    public void index() {
        render("index.html");
    }
    
    public void getConsumerList() {
        render("consumerList.html");
    }
    
    public void getLibInOutList() {
        render("libInOutList.html");
    }
    
    /**
     * 获取进出图书馆top10
     */
    public void getLibInOutTop10Data() {
        Client client = ESConnector.getConnection();
        SearchRequestBuilder srb = client.prepareSearch("tsgmj").setTypes("tsgmj");
        srb.addAggregation(AggregationBuilders.terms("cardid_count").field("cardid"));

        SearchResponse searchResponse = srb.get();
        Map<String, Aggregation> aggMap = searchResponse.getAggregations().asMap();
        System.out.println(aggMap);
        StringTerms teamAgg= (StringTerms) aggMap.get("cardid_count");
        Iterator<Bucket> teamBucketIt = teamAgg.getBuckets().iterator();
        Map<String,List> result = new HashMap<String,List>();
        List<String>  cards = new ArrayList<String>();
        List<Long> counts = new ArrayList<Long>();
        while (teamBucketIt .hasNext()) {
            Bucket buck = teamBucketIt .next();
              //球队名
            String cardid = (String) buck.getKey();
              //记录数
            long count = buck.getDocCount();
            cards.add(cardid);
            counts.add(count);
        }
        result.put("cards", cards);
        result.put("counts", counts);
        renderJson(result);
    }
}



