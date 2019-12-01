<template>
  <div>
    <!-- echarts的容器 -->
    <div ref="main" id="main" style="width:100%;height:100%;background:#ccc;"></div>
  </div>
</template>

<script>
// 导包
import echarts from "echarts";
export default {
  name: "datarecord",
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(this.$refs.main);

    // 指定图表的配置项和数据
    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        orient: "vertical",
        x: "left",
        data: ["黑马", "京东", "阿里"]
      },
      series: [
        {
          name: "访问来源",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          color: ["#f76137", "#f9b358", "#409eff"],
          label: {
            normal: {
              show: false,
              position: "center"
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: "30",
                fontWeight: "bold"
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            { value: 335, name: "黑马" },
            { value: 310, name: "京东" },
            { value: 234, name: "阿里" }
          ]
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }
};
</script>

<style>
</style>
