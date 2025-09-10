import { useDescope } from '@descope/react-sdk';
 
function ConnectButton() {
  const { sdk } = useDescope();
  
  const handleConnect = async () => {
    try {
      await sdk.outbound.connect('gmail', {
        redirectURL: 'https://app.example.com/post-connection',
        token:"eyJhbGciOiJSUzI1NiIsImtpZCI6IlNLMzJTQ2NFa2FZMDJ5NTVoMWV3TzNWN3ZmNHBtIiwidHlwIjoiSldUIn0.eyJhbXIiOlsib2F1dGgiXSwiZHJuIjoiRFMiLCJleHAiOjE3NTc1MDIzMDQsImlhdCI6MTc1NzUwMTcwNCwiaXNzIjoiUDMyU0NjNXA5WU8ycnFoejJuOHExSTF2eW5PMCIsInJleHAiOiIyMDI1LTEwLTA4VDEwOjU1OjA0WiIsInN1YiI6IlUzMlNESW5zQzUyWmd1SmFhNzVXUDNUSmpKY1cifQ.Ds3MN5FC5c6m-S_dS-D8l4cv-VjK1_MIyabMw3ZoVs_d9_gpSFgOjYxA1G7kAO4wS7TRzO7VysiQ3zcai0AyH6lEdw2HFbijoaGvENhhAcvcgC7WcJ38RdGgaG-3_0qSWo5PVBWbGq0Z0Zg5bxY9R929ipMkeUc_emBS-pCwVmIyCedJvKRK5Cri2SH9U-W5j4zAPsOmIUdWcgnDx9cpidGRNQ6utHWGuSgVPKd-z1VCMvjgKg1XLMuw9whv8yevSqrI0C7SR0Ofqffmepujq3T_ewBEn5V0-E5OmqULxQHKRI-l2_SQk1KCP_djIlKab-iE9PJufHl8NBNK3mjuuA"
      });
    } catch (error) {
      console.error('Error connecting to Google:', error);
    }
  };
  
  return (
    <button onClick={handleConnect}>
      Connect to Outbound App
    </button>
  );
}
 
export default ConnectButton;