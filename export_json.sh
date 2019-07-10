#!/usr/bin/env bash

sqlite3 ./dist/data.sqlite "SELECT code,name,fullName,lat,lng FROM province ORDER BY code;" | awk -F'|' '
   { code[++i]=$1; name[i]=$2; fullName[i]=$3; lat[i]=$4; lng[i]=$5; }
   END {
      printf "[";
      for(j=1;j<=i;j++){
         printf "{|code|:|%s|,|name|:|%s|,|fullName|:|%s|,|lat|:|%s|,|lng|:|%s|",code[j],name[j],fullName[j],lat[j],lng[j]
         closing="},"
         if(j==i){closing="}"}
         printf closing;
      }
      printf "]";
   }' | tr '|' '"' > ./dist/provinces.json


sqlite3 ./dist/data.sqlite "SELECT code,name,fullName,lat,lng, provinceCode FROM city ORDER BY code;" | awk -F'|' '
   { code[++i]=$1; name[i]=$2; fullName[i]=$3; lat[i]=$4; lng[i]=$5; provinceCode[i]=$6}
   END {
      printf "[";
      for(j=1;j<=i;j++){
         printf "{|code|:|%s|,|name|:|%s|,|fullName|:|%s|,|lat|:|%s|,|lng|:|%s|, |provinceCode|:|%s|",code[j],name[j],fullName[j],lat[j],lng[j],provinceCode[j]
         closing="},"
         if(j==i){closing="}"}
         printf closing;
      }
      printf "]";
   }' | tr '|' '"' > ./dist/cities.json


sqlite3 ./dist/data.sqlite "SELECT code,name,fullName,lat,lng, provinceCode, cityCode FROM area ORDER BY code;" | awk -F'|' '
   { code[++i]=$1; name[i]=$2; fullName[i]=$3; lat[i]=$4; lng[i]=$5; provinceCode[i]=$6; cityCode[i]=$7}
   END {
      printf "[";
      for(j=1;j<=i;j++){
         printf "{|code|:|%s|,|name|:|%s|,|fullName|:|%s|,|lat|:|%s|,|lng|:|%s|,|provinceCode|:|%s|,|cityCode|:|%s|",code[j],name[j],fullName[j],lat[j],lng[j],provinceCode[j],cityCode[j]
         closing="},"
         if(j==i){closing="}"}
         printf closing;
      }
      printf "]";
   }' | tr '|' '"' > ./dist/areas.json