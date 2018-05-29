<%@ page language="java" pageEncoding="UTF-8"%>
<script type="text/javascript">
var path = '${path}';
</script>

<div class="navbar  navbar-inverse" role="navigation">
  <div class="container-fluid">
    <div class="navbar-header">
      <a href="/" class="navbar-brand"><span class="glyphicon glyphicon-fire"></span> 产品首页</a>
    </div>
    <div class="navbar-collapse collapse" id="navbar-main">
      <ul class="nav navbar-nav">
	        	<li class="dropdown">
	        	   <a class="dropdown-toggle" data-toggle="dropdown" href="#"><span >信贷产品管理</span></a>
	        	   <ul class="dropdown-menu">
						<li><a href="/product">信贷产品管理</a></li>
						<li><a href="/productRule">信贷产品规则管理</a></li>
						<li><a href="/preOrder">信贷产品预约管理</a></li>
						<li><a href="/label">信贷产品标签管理</a></li>
					</ul> 
	        	</li>
	  </ul>
	   <ul class="nav navbar-nav">
	        	<li class="dropdown">
	        	   <a class="dropdown-toggle" data-toggle="dropdown" href="#"><span >理财产品管理</span></a>
	        	   <ul class="dropdown-menu">
						<li><a href="/finance">理财产品管理</a></li>
					</ul> 
	        	</li>
	  </ul>
	   <ul class="nav navbar-nav">
	        	<li class="dropdown">
	        	   <a class="dropdown-toggle" data-toggle="dropdown" href="#"><span >统计管理</span></a>
	        	   <ul class="dropdown-menu">
						<li><a href="/statisticsRecord">统计数据录入管理</a></li>
						<li><a href="/statisticsRecord/orgIndex">机构管理</a></li>
					</ul> 
	        	</li>
	  </ul>
	  <ul class="nav navbar-nav">
	        	<li class="dropdown">
	        	   <a class="dropdown-toggle" data-toggle="dropdown" href="#"><span >基础管理</span></a>
	        	   <ul class="dropdown-menu">
						<li><a href="/sysDict">字典数据管理</a></li>
					</ul> 
	        	</li>
	  </ul>
	   <ul class="nav navbar-nav">
	        	<li class="dropdown">
	        	   <a class="dropdown-toggle" data-toggle="dropdown" href="#"><span >es查询</span></a>
	        	   <ul class="dropdown-menu">
						<li><a href="/getLibInOutList">图书馆记录查询</a></li>
					</ul> 
	        	</li>
	  </ul>
	   <ul class="nav navbar-nav">
	        	<li class="dropdown">
	        	   <a class="dropdown-toggle" data-toggle="dropdown" href="#"><span >日志采集管理</span></a>
	        	   <ul class="dropdown-menu">
						<li><a href="/log/bizsys">业务系统管理</a></li>
						<li><a href="/log/logsourceinfo">日志源管理</a></li>
						<li><a href="/log/logCollectMachine">采集服务管理</a></li>
						<li><a href="/log/logcollect">采集任务管理</a></li>
						<li><a href="/log/ftpTask">ftp任务管理</a></li>
					</ul> 
	        	</li>
	  </ul>
      <ul class="nav navbar-nav navbar-right" style="font-size: 12px;font-weight: normal;">
        <li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#" id="download">admin <span class="caret"></span></a>
          <ul class="dropdown-menu" aria-labelledby="download">
            <li><a href="./bootstrap.min.css">设置</a></li>
            <li><a href="/login/logout">退出</a></li>
          </ul></li>
      </ul>
    </div>
  </div>
</div>