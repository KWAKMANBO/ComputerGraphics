## 1.요구사항
- 내 이름 이니셜을 표현하는 Model만들기
- 점(point), 선(line segments), 삼각형(triangles)를 모델링에 사용하기
- 이니셜이 회전 및 이동 등 움직이게하기
- 버튼, 슬라이더 등 상호작용 추가하기
- 
## 2. 구현 사항
- 이니셜 (KHS), 이벤트 3개(버튼, 슬라이더, 키보드 입력)
- 파일 webgl-utils.js, initShaders.js, Common/MV.js 를 source파일로 사용
## 3. 코드 설명
- Triangle, line을 이용해서이니셜 KHS를 구현 
- 화면 가운데에 버튼, 슬라이더, 그리고 안내문구 3개의 구성요소가 있고 슬라이더를 이용해 이니셜의 회전 속도를 조절할 수 있음
- 처음에는 회전속도가 0 이라 정지 상태에 있고 슬라이더 게이지를 늘리면 회전이 시작되고 게이지의 크기가 커질 수록 회전 속도가 빨라 지도록 구현
- 슬라이더는 min = 0 (정지상태), value = 0.0(초기 시작 상태)로 시작해서 max= 0.10 으로 최대 0.1까지 값을 가질 수 있게 설정
- 회전하는 이니셜(슬라이더를 늘려야 회전)을 멈추고싶으면 Stop or Start버튼을 클릭하면 이니셜을 멈추게하거나 아니면 다시 회전 시킬 수 있음
- 버튼을 클릭하면 JavaScript에서 Direction변수를 반대 상태로 변경하게되는데 Direction이 True였다면 회전각 Theta에 회전 속도를의미하는 변수 Speed(슬라이더가 커지면 커질수록 값도 커짐)를 반환하고, Direction이 False였다면 0.0을변환해 회전을 멈추게합니다.
- Space Bar를 눌러보면 채워져 있던 이니셜들이 point, line으로 구성된 뼈대만 남은 이니셜로 바뀌게 됨
## 4. 구현 결과

![a1](https://github.com/KWAKMANBO/ComputerGraphics/assets/113917771/155b865a-c076-4f34-83bb-629859eaab8f)
