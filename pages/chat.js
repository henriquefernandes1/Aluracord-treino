import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzQxMjE3MywiZXhwIjoxOTU4OTg4MTczfQ.ongzUxJOACCFlbs-EnIqUqLSxUOPiv1Go2E3CzwfsLI';
const SUPABASE_URL = 'https://xjgqgilnaojcrhnbtiil.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ChatPage() {
    // A lógica vai aqui
    const [mensagem, setMensagem] = React.useState('');
    const [listaChat, setListaChat] = React.useState([]);

    React.useEffect(() => {
        supabaseClient
            .from('listaMensagens')
            .select('*')
            .then(({ data }) => {
                setListaChat(data);
            });
    }, []);

    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            texto: novaMensagem,
            de: 'henriquefernandes1',
        }

        supabaseClient
            .from('listaMensagens')
            .insert([mensagem]) //DEVE TER OS MESMOS TIPOS QUE TÊM NO BANCO DE DADOS DO SUPABASE!!!
            .order('id', {ascending: false})
            .then(({ data }) => {
                setListaChat([
                    data[0],
                    ...listaChat, //A sintaxe ...array não adiciona um array dentro de outro, mas sim os itens de um array dentro de outro

                ]);
            });

        setMensagem('');
    }
    // ./A lógica vai aqui
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary["Vermelho"],
                backgroundImage: `url(http://cdn.onlinewebfonts.com/svg/img_315544.png)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundBlendMode: 'multiply', backgroundPosition: 'center',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals["glass"],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals["glass"],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >


                    <MessageList mensagens={listaChat} />

                    {/*{listaChat.map((mensagemAtual) => {
                        console.log(mensagemAtual);
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        );
                    })}*/}
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => { //Arrow function;

                                const valor = event.target.value;
                                setMensagem(valor);
                            }}

                            onKeyPress={(Event) => {
                                if (Event.key === 'Enter') {
                                    Event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}

                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5' styleSheet={{
                    width: '100%',
                    border: '0',
                    resize: 'none',
                    borderRadius: '5px',
                    padding: '6px 8px',
                    backgroundColor: appConfig.theme.colors.neutrals[800],
                    marginRight: '12px',
                    color: appConfig.theme.colors.neutrals[200],
                }}>

                    CHAT
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                    styleSheet={{
                        width: '10%',
                        border: '0',
                        resize: 'none',
                        borderRadius: '5px',
                        padding: '6px 8px',
                        backgroundColor: appConfig.theme.colors.neutrals[800],
                        marginRight: '12px',
                        color: appConfig.theme.colors.neutrals[200],
                    }}
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {mensagem.texto}
                    </Text>);
            })}

        </Box>
    )
}