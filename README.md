# 📑 잡다 (JobDa) 
**채용공고와 이력서를 표준화해, AI가 가장 ‘잘 맞는 인재’를 찾아주는 채용 코파일럿**

<img width="541" height="228" alt="화면 캡처 2025-11-02 172301" src="https://github.com/user-attachments/assets/3319c5c0-04c3-4c92-aee6-c0fa1d4301b0" />


## 📝 프로젝트 소개

**잡다(JobDa)** 는 채용 담당자와 면접관의 업무 효율을 획기적으로 높이는  
**AI 기반 채용 추천 & 면접 지원 시스템**입니다.

현재의 채용 시스템에서 채용담당자는 **수백 개 이력서에서 원하는 요구스킬·경력 적합도를 빠르게 판별**하기 어렵습니다. <br>
기존 채용에서는 이력서와 공고의 표현 방식이 제각각이라 **적합한 인재를 찾기 어렵고**,  
면접은 **질문 구성, 기록, 피드백**이 일관되지 않아 **채용 결정이 비효율적**이었습니다.

> 잡다는 이러한 문제를 해결하기 위해, 다음과 같은 기능을 제공합니다:

- ✨ **JD(채용공고) & 이력서 자동 표준화**
- 🔍 **검색 엔진 기반의 가장 알맞는 이력서/후보 추천**
- 🤖 **AI 기반 질문 세트 생성 + 실시간 면접 진행**
- 📊 **공고 현황/면접 일정 캘린더 등 시각화된 대시보드**
- 🧠 **면접 기록 자동 요약 및 강점/개선점 도출**

## 💡 이런 팀에게 추천해요!

- "적합한 지원자를 빠르게 찾고 싶어요"
- "면접을 일관되고 효율적으로 진행하고 싶어요"
- "팀 내 채용 프로세스를 정량적으로 관리하고 싶어요"

## 📗 잡다와 함께,  
**채용의 정확도는 높이고, 시간은 줄이세요.**  
면접관의 시간은 아끼고, 채용은 효율적으로 진행하는 채용 프로세스의 진짜 코파일럿, **잡다(JobDa)** ✨

---

## 📃 관련 문서
### 🔗 배포 링크
[서비스 바로가기](https://jobda.vercel.app/login)

## 문서
[![Figma](https://img.shields.io/badge/Figma-Design-F24E1E?logo=figma&logoColor=white)](https://www.figma.com/design/UPdtMBrqB7IAYrJMq9Xsd4/JOBDA)
[![Notion](https://img.shields.io/badge/Notion-Docs-000000?logo=notion&logoColor=white)](https://www.notion.so/Team2-2933550b7b558091945ec4b806f224c0)


---

## 🖼️ 시스템 아키텍처
<img width="1600" height="1000" alt="AIBE3_FINAL_아키텍쳐 drawio" src="https://github.com/user-attachments/assets/db596af9-f284-4494-9181-78d1e6c96b55" />

---

## 📌 팀원 구성

|<img src="https://avatars.githubusercontent.com/u/144124353?s=400&u=9bda70cb07b771d6301ac64df65acb931406b09e&v=4" width="125" />|<img src="https://avatars.githubusercontent.com/u/82808715?v=4" width="125" />|<img src="https://avatars.githubusercontent.com/u/217855127?v=4" width="125" />|<img src="https://avatars.githubusercontent.com/u/99888873?v=4" width="125" />|<img src="https://avatars.githubusercontent.com/u/96305452?v=4" width="125" />|<img src="https://avatars.githubusercontent.com/u/121555686?v=4" width="125" />|
|:---------:|:---------:|:---------:|:---------:|:---------:|:---------:|
|[유승인 (팀장)](https://github.com/seung-in-Yoo)|[김정호](https://github.com/Unoguna)|[김지윤](https://github.com/jiyoon-00)|[심수민](https://github.com/SWWWin)|[유승재](https://github.com/JaeSeungJae)|[정다솔](https://github.com/dbjoung)|
|FE, BE|FE, BE|FE, BE|FE, BE|FE, BE|FE, BE|

---

## 🛠 기술 스택 및 도입 이유 

### Frontend
| Category | Stack | 도입 이유 |
|--------|------|----------|
| Framework | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | 컴포넌트 기반 구조로 복잡한 화면 상태를 효율적으로 관리하기 위해 사용 |
| Build Tool | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) | 빠른 개발 서버와 빌드 속도를 통해 개발 생산성을 높이기 위해 선택 |
| Styling | ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) | 디자인 시스템을 일관되게 유지하고 빠른 UI 개발을 위해 도입 |

---

### Backend
| Category | Stack | 도입 이유 |
|--------|------|----------|
| Web Framework | ![Spring MVC](https://img.shields.io/badge/Spring%20MVC-6DB33F?style=for-the-badge&logo=spring&logoColor=white) | REST API 기반 서비스 구조를 설계하고 확장하기 위해 사용 |
| Security | ![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white) | JWT 기반 인증 및 역할별 접근 제어를 분리하기 위해 도입 |
| Authentication | ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) | 무상태 인증 방식으로 확장성과 보안을 동시에 확보하기 위해 사용 |
| Real-time Communication | ![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge) | 면접관과 지원자간의 채팅 등 실시간 이벤트를 즉시 전달하기 위해 사용 |
| Real-time Communication | ![SSE](https://img.shields.io/badge/SSE-010101?style=for-the-badge) | 실시간 알림 등 이벤트를 즉시 전달하기 위해 사용 |

---

### Search & AI
| Category | Stack | 도입 이유 |
|--------|------|----------|
| Search Engine | ![Elasticsearch](https://img.shields.io/badge/Elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white) | 이력서와 채용공고를 단순 조회가 아닌 키워드 기반 점수 계산 및 유사도 검색으로 처리하기 위해 도입하여 대량 데이터에서도 빠른 추천 조회가 가능하도록 설계 |
| Search Visualization | ![Kibana](https://img.shields.io/badge/Kibana-005571?style=for-the-badge&logo=kibana&logoColor=white) | 색인 상태 및 검색 쿼리 결과를 시각적으로 확인하며 디버깅에 사용 |
| Cache | ![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white) | 추천 결과, AI 생성 결과를 캐싱하여 반복 요청 시 응답 속도를 개선하기 위해 사용 |
| LLM Tool Layer | ![MCP](https://img.shields.io/badge/MCP%20Client-000000?style=for-the-badge) | LLM이 필요한 시점에만 내부 데이터를 Tool로 조회하도록 하여, 프롬프트 복잡도와 응답 비용을 줄이기 위해 도입 |
| AI Framework | ![Spring AI](https://img.shields.io/badge/Spring%20AI-6DB33F?style=for-the-badge&logo=spring&logoColor=white) | 채용공고 키워드 추출, 이력서 요약, 추천 사유 생성을 서버 로직과 자연스럽게 결합하기 위해 사용 |

---

### Infrastructure
| Category | Stack | 도입 이유 |
|--------|------|----------|
| Compute | ![AWS EC2](https://img.shields.io/badge/AWS%20EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white) | WAS와 검색/AI 역할을 분리 배포하여 트래픽과 리소스를 독립적으로 관리하도록 사용 |
| Database | ![Amazon RDS](https://img.shields.io/badge/Amazon%20RDS-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white) | 안정적인 운영과 백업/복구를 위해 관리형 데이터베이스를 도입 |
| RDBMS | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) | 채용공고, 이력서, 매칭 결과 등 정형 데이터를 안정적으로 관리하기 위해 사용 |
| Object Storage | ![AWS S3](https://img.shields.io/badge/AWS%20S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white) | 이력서 파일 저장 및 Presigned URL 제공을 위해 도입 |

---

### DevOps & Monitoring
| Category | Stack | 도입 이유 |
|--------|------|----------|
| Reverse Proxy | ![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white) | HTTPS 처리 및 트래픽 라우팅을 안정적으로 수행하기 위해 사용 |
| Container | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) | 환경 차이 없이 동일한 실행 환경을 보장하기 위해 컨테이너 기반으로 배포 |
| CI/CD | ![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white) | 테스트 및 배포를 자동화하여 안정적인 릴리즈를 위해 사용 |
| Monitoring | ![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white) | 서버 자원과 애플리케이션 상태를 시각적으로 모니터링하기 위해 사용 |
| Metrics | ![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white) | 애플리케이션 메트릭을 수집하여 성능 이상 여부를 조기에 파악하기 위해 도입 |
---


---

## ✨ 핵심 기능 소개
### 🔔 SSE

| 실시간 알림 |
|----------|
|![EC958CEBA6BC-2](https://github.com/user-attachments/assets/a9db26b1-5c20-4394-a90e-a00bde29a520)|

### 💬 채팅
### 🔎 ELS

| 추천 지원자 조회 |
|----------|
|![elasticsearch-7](https://github.com/user-attachments/assets/61a495a5-c901-47bf-b2f2-5d2d948c8851)|


### 🤖 MCP
| 면접 질문 생성 |
|----------|
|![KakaoTalk_Video_2025-12-16-10-58-56](https://github.com/user-attachments/assets/391cb11a-01b7-403f-b50e-5bac5973cd48)|

| AI 면접 요약 |
|----------|
|![면접요약-강조](https://github.com/user-attachments/assets/1e27bec2-1848-4117-9677-6c96ed4bf3eb)|


--- 
## 🛠 트러블 슈팅 
### 1. Elasticsearch 추천/검색 성능 개선
**📌 문제 상황**

이력서 추천 API 호출 시, 매 요청마다 동일한 추천 로직과 AI 호출이 반복되며
초기 응답 시간이 5초 이상 (5400ms) 소요되는 성능 문제가 발생

특히:
- Elasticsearch 검색
- 다수의 JPA 연관 엔티티 조회
- JD 키워드 추출 / 이력서 요약 / 추천 사유 생성 등 OpenAI 기반 연산
이 한 요청 안에서 모두 수행되며 응답 속도 측면에서 문제가 명확히 드러났음.

**🔍 원인 분석**
1. 중복 연산 문제
2. 동일 JD에 대해 추천 결과가 매번 새로 계산됨
3. N+1 문제
4. Resume 조회 시 다수의 연관 엔티티가 Lazy 로딩
5. AI 호출 비용 - 첫 호출 시 OpenAI 기반 연산이 다수 포함되어 최소 3초 이상 소요

**1️⃣ 1차 개선 — Redis 캐시 도입 (추천 결과 캐싱)**

**✔️ 적용 내용**
- JD 기준 추천 결과를 Redis에 캐싱
- 두 번째 호출부터는 계산 없이 즉시 반환

```java
redisTemplate.opsForValue().set("recommend:jd_" + jdId, data, TTL);
```


**📊 결과**
| 호출 횟수 | 실행 시간 |
|----------|----------|
| 첫 호출 | 5409ms |
| 두 번째 호출 | 737ms |
| 세 번째 호출 | 592ms |


👉 캐시 효과는 명확했지만, 첫 호출이 여전히 느림

**2️⃣ 2차 개선 — N+1 문제 해결 시도 (Fetch Join)**
**✔️ 시도**

연관 엔티티를 한 번에 로딩하기 위해 Fetch Join 적용
```java
@Query("""
    SELECT r FROM Resume r
    LEFT JOIN FETCH r.educations
    LEFT JOIN FETCH r.experiences
    LEFT JOIN FETCH r.skills
    WHERE r.id = :resumeId
""")
```

**❌ 문제 발생**
```java
MultipleBagFetchException:
cannot simultaneously fetch multiple bags
```
- Hibernate는 2개 이상의 List 컬렉션 Fetch Join을 허용하지 않음

**✔️ 최종 해결**
- 1개 컬렉션만 Fetch Join
- 나머지는 @BatchSize 적용
```java
@Query("""
    SELECT DISTINCT r FROM Resume r
    LEFT JOIN FETCH r.experiences
    WHERE r.id = :resumeId
""")
Optional<Resume> findWithEssentialDetailsById(Long resumeId);
```

**3️⃣ 핵심 해결 — 비동기 캐싱 + Lazy 추천 제공**
💡 설계 전환 -> “첫 요청에서 모든 걸 계산하지 말자”
**기존 방식**
- 요청 → 모든 계산 수행 → 응답
**개선 방식**
```
Client Request
   ↓
Redis Cache 확인
   ↓        ↘
Cache Hit → 즉시 반환
   ↓
Cache Miss → 비동기 추천 계산 시작
            → "추천 준비 중" 응답
```
**✔️ 비동기 캐싱 적용**
```java
@Async
public void warmUpRecommendation(Long jdId) {
    List<ResumeRecommendationDto> result =
        recommendationCoreService.calculateRecommendations(jdId);
    redisRecommendationCacheService.saveRecommendations(jdId, result);
}
```
**📊 최종 성능 결과**
| 시점 | 실행 시간 |
|-----|----------|
| 첫 요청 (비동기 트리거) | ~1700ms |
| 두 번째 호출 | 102ms |
| 세 번째 호출 | 14ms |

👉 체감 성능 대폭 개선 + 서버 부하 감소


**4️⃣ 추가 리팩토링 — AI 결과 영속성 개선** 
**🧠 문제 인식**
- JD 키워드, 이력서 요약, 추천 사유는 영속성이 높은 데이터로, Redis에만 저장하는 구조는 적절하지 않음

**✔️ 개선 구조**
```
요청
 ↓
Redis 조회
 ↓        ↘
HIT      MISS
 ↓        ↓
반환     DB 조회
          ↓        ↘
         HIT       MISS
          ↓         ↓
     Redis 캐싱     AI 호출
                    ↓
                 DB 저장 + Redis 캐싱
```

**✔️ 효과**
- AI 호출 횟수 최소화
- 재시작/TTL 만료에도 데이터 유지
- Redis는 가속 레이어 역할만 수행

### ✅ 최종 정리
- Redis 캐싱으로 중복 연산 제거
- Fetch Join + BatchSize로 N+1 문제 완화
- 비동기 캐싱으로 첫 호출 체감 성능 개선
- AI 결과는 DB에 영속 저장하여 구조적 안정성 확보



