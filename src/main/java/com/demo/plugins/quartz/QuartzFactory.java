package com.demo.plugins.quartz;

/**
 * @author chenwentao@trustmo.com
 *
 * 2015-3-18
 */
import static org.quartz.CronScheduleBuilder.cronSchedule;
import static org.quartz.JobBuilder.newJob;
import static org.quartz.TriggerBuilder.newTrigger;

import java.util.ArrayList;
import java.util.Date;
import java.util.Set;

import org.apache.commons.lang3.time.DateUtils;
import org.quartz.CronTrigger;
import org.quartz.Job;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerFactory;
import org.quartz.SimpleTrigger;
import org.quartz.Trigger;
import org.quartz.TriggerKey;
import org.quartz.impl.matchers.GroupMatcher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



/**
 * QuartzFactory
 * @author WWF
 */
public class QuartzFactory {
    public static Logger log = LoggerFactory.getLogger(QuartzFactory.class);
    public static SchedulerFactory sf;

    public static void startTask(String con,Class<? extends Job> jobClass) {
      try {
          Scheduler sched = sf.getScheduler();
          JobDetail job = newJob(jobClass)
              .withIdentity("job_rebuild", "grp_rebuild")
              .requestRecovery()
              .build();
          //job.getJobDataMap().put("name", "task:");
          CronTrigger trigger = null;
          trigger = newTrigger()
              .withIdentity("trigger_rebuild", "grp_rebuild")
              .withSchedule(cronSchedule(con))
              .build();
          // 定时执行
          Date ft =sched.scheduleJob(job, trigger);

          log.info(job.getKey() + " has been scheduled to run at: " + ft
            + " and repeat based on expression: "
            + trigger);
         // sched.start();
    } catch (Exception e) {
        e.printStackTrace();
    }

    }
    /**
     * 定时开始任务
     * @param startTime
     * @param id
     * @param name
     * @param group
     * @param jobClass
     */
    public static void startJobOnce(String startTime, String id,Class<? extends Job> jobClass){
        try {
            Scheduler sched = sf.getScheduler();
            // define the job and tie it to our HelloJob class
              JobDetail job = newJob(jobClass)
                  .withIdentity("job_"+id, "group_"+id)
                  .requestRecovery()
                  .build();
              job.getJobDataMap().put("name", "task:"+id);
              //CronTrigger trigger = null;
             // trigger = newTrigger()
              //    .withIdentity("job_"+name+"_"+id, "group_"+group+"_"+id)
              //    .withSchedule(cronSchedule("00 * * * * ?"))
              //    .build();
              // 定时执行
              SimpleTrigger trigger = (SimpleTrigger) newTrigger()
                  .withIdentity("trigger_"+id, "group_"+id)
                  .startAt(DateUtils.parseDate(startTime,"yyyy-MM-dd hh:mm:ss"))
                  .build();

             //.startAt(DateUtil.parseDate(startTime, DateUtil.DEFAULT_FORMAT))
              Date ft =sched.scheduleJob(job, trigger);

              log.info(job.getKey() + " has been scheduled to run at: " + ft
                + " and repeat based on expression: "
                + trigger);
             // sched.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    /**
     * 停止任务
     * @param name
     * @param group
     * @param id
     * String name,String group,int id
     */
    public static void stopJob(String id){
        try {
            if (sf!=null) {
                Scheduler scheduler = sf.getScheduler();
                TriggerKey triggerKey = TriggerKey.triggerKey("trigger_"+id,"group_"+id);
                Trigger trigger = scheduler.getTrigger(triggerKey);
                if (trigger!=null) {
                    scheduler.pauseTrigger(triggerKey);
                    scheduler.unscheduleJob(triggerKey);
                    scheduler.deleteJob(trigger.getJobKey());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void stopAllJobs() {
      try {
      Scheduler sched = sf.getScheduler();
      GroupMatcher<JobKey> matcher = GroupMatcher.groupContains("group");
      GroupMatcher<TriggerKey> matcher1 = GroupMatcher.triggerGroupStartsWith("group");
      Set<TriggerKey> set1 = sched.getTriggerKeys(matcher1);
      for(TriggerKey key :set1) {
        sched.pauseTrigger(key);
      }
      sched.unscheduleJobs(new ArrayList(set1));

      Set<JobKey> set = sched.getJobKeys(matcher);
      sched.deleteJobs(new ArrayList(set));
      } catch (Exception e) {
        e.printStackTrace();
    }
  }

}
