import React, {Component} from "react";
import { PageHeader, Tag, Button, Statistic, Row, Popover, Layout, Typography, Divider, Spin, Space} from 'antd';
import {Loader} from 'semantic-ui-react'
import QRCode from "react-qr-code";
//import Tts from 'react-native-tts';

const { Header, Sider, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

class FoodPage extends Component{
    constructor(props) {
      super(props);
      this.state = {
        title:"",
        loading_1:true,
        loading_2:true,
        ingredients: [],
        recipe: [],
        times:[],
        infos:[],
        stepnum: 0,
        stepArr:"",
        special:1
      }
      //this.setState({title: this.props.location.pathname.split('/food/')[1]});
      console.log("title : ",this.props.title);

/*
      fetch('http://192.249.19.243:0280/main/ingredients/'+this.props.title)
        .then(res => res.json())
        .then(data => this.setState({ingredients:data}))
        .then(()=>this.setState({loading_1: false}));*/

       //Times Fetch
       fetch('http://192.249.19.243:0280/main/recipe_timer/'+this.props.title)
           .then(res => res.json())
           .then(data => this.setState({times:data}));
    }

    getIngredient(){
      fetch('http://192.249.19.243:0280/main/ingredients/'+this.props.title)
        .then(res => res.json())
        .then(data => this.setState({ingredients:data}))
        .then(()=>this.setState({loading_1: false}));
    }

    getRecipe(){
      fetch('http://192.249.19.243:0280/main/recipe_text/'+this.props.title)
           .then(res => res.json())
           .then(data => this.setState({recipe:data}))
           .then(()=>this.setState({loading_2: false}));
    }

    getInfos(){
      fetch('http://192.249.19.243:280/main/food_info/'+this.props.title)
           .then(res => res.json())
           .then(data => this.setState({infos:data}));
    }

    componentWillMount(){
      this.getIngredient();
      this.getRecipe();
      this.getInfos();
    }
    componentDidMount(){
      //Tts.speak('Hello, world!');
    }

    state = {
      visible: false,
    };

    hide = () => {
    this.setState({
        visible: false,
    });
    };

    handleVisibleChange = visible => {
    this.setState({ visible });
    };
        
    render(){
        console.log("Main List render in!");
        console.log("ingredients : ",this.state.ingredients);
        console.log("recipe : ",this.state.recipe);
        
        return (
          <>
          <PageHeader
            onBack={() => window.history.back()}
            title={this.props.title.replace(/_/g," ")}
            extra={[
              <Popover
                        content={<div><p><QRCode value={"/mobile/"+this.props.title} size="100" class="qr"/></p><a onClick={this.hide}>Close</a></div>}
                        title="Scan this!"
                        placement="bottom"
                        trigger="click"
                        visible={this.state.visible}
                        onVisibleChange={this.handleVisibleChange}>
                          
                        <Button type="primary">Send to phone</Button>
              </Popover>,
            ]}
          >
            <Row>
              <Statistic
                title="Total Time"
                prefix={<i class="far fa-clock fa-1x"></i>}
                value={this.state.infos[1]} />
              <Statistic
                title="Difficulty"
                prefix={<i class="far fa-laugh fa-1x"></i>}
                value={this.state.infos[2]}
                style={{
                  margin: '0 32px',
                }}
              />
            </Row>
            <Row>
              <Content
              className="site-layout-background"
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
              }}>
                <img width="200" src={"http://192.249.19.243:0280/main/image/"+this.props.title}></img>
                <Title level={4}>{this.state.infos[0]}</Title>
                <Divider/>
                <Title level={2}>Ingredients</Title>
                <Paragraph>
                  {this.state.ingredients.map(item => <p>{item}</p>)}     
                  <div style={{'text-align':'center', 'width':"100%"}}>
                    <Spin spinning={this.state.loading_1}/>
                  </div>             
                </Paragraph>
                <Divider />
                <Title level={2}>Recipe</Title>
                <Paragraph>
                  {this.state.recipe.map(item => <p>{item}</p>)}
                  <div style={{'text-align':'center', 'width':"100%"}}>
                    <Spin spinning={this.state.loading_2}/>
                  </div> 
                </Paragraph>
                
            </Content>
            </Row>
          </PageHeader>
          </>
        );
    }
}
export default FoodPage;